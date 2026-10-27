"""Runtime-configurable OpenAI-compatible LLM provider for MedVision AI."""

import json
import os
import threading
from typing import Any, Dict, List, Optional

import requests

PROVIDER_PRESETS: Dict[str, Dict[str, Any]] = {
    "groq": {
        "label": "Groq",
        "base_url": "https://api.groq.com/openai/v1",
        "model": "llama-3.3-70b-versatile",
        "signup_url": "https://console.groq.com/keys",
        "note": "Free tier with fast Llama models. Recommended for this demo.",
    },
    "openrouter": {
        "label": "OpenRouter",
        "base_url": "https://openrouter.ai/api/v1",
        "model": "meta-llama/llama-3.3-70b-instruct:free",
        "signup_url": "https://openrouter.ai/keys",
        "note": "Many free and paid models; availability of :free models varies.",
    },
    "gemini": {
        "label": "Google Gemini",
        "base_url": "https://generativelanguage.googleapis.com/v1beta/openai",
        "model": "gemini-2.5-flash",
        "signup_url": "https://aistudio.google.com/apikey",
        "note": "Google AI Studio free tier, exposed through its OpenAI-compatible API.",
    },
    "openai": {
        "label": "OpenAI",
        "base_url": "https://api.openai.com/v1",
        "model": "gpt-4o-mini",
        "signup_url": "https://platform.openai.com/api-keys",
        "note": "Paid API. Use a project key with a low spending limit.",
    },
    "custom": {
        "label": "Custom OpenAI-compatible",
        "base_url": "",
        "model": "",
        "signup_url": "",
        "note": "Any server exposing POST /chat/completions, including local gateways.",
    },
}

_ENV_KEYS = {
    "groq": ["GROQ_API_KEY"],
    "openrouter": ["OPENROUTER_API_KEY"],
    "gemini": ["GEMINI_API_KEY", "GOOGLE_API_KEY"],
    "openai": ["OPENAI_API_KEY"],
}

_LOCK = threading.Lock()
_RUNTIME_CONFIG: Dict[str, Any] = {}


class LLMProviderError(RuntimeError):
    pass


def _clean_base_url(value: str) -> str:
    return str(value or "").strip().rstrip("/")


def _normalize_config(config: Dict[str, Any], source: str) -> Dict[str, Any]:
    provider = str(config.get("provider") or "").strip().lower()
    preset = PROVIDER_PRESETS.get(provider, {})
    base_url = _clean_base_url(config.get("base_url") or preset.get("base_url", ""))
    model = str(config.get("model") or preset.get("model", "")).strip()
    return {
        "provider": provider,
        "api_key": str(config.get("api_key") or "").strip(),
        "model": model,
        "base_url": base_url,
        "source": source,
    }


def get_active_config() -> Optional[Dict[str, Any]]:
    with _LOCK:
        if _RUNTIME_CONFIG.get("api_key") or _RUNTIME_CONFIG.get("base_url"):
            return dict(_RUNTIME_CONFIG)

    explicit_key = os.environ.get("LLM_API_KEY", "").strip()
    if explicit_key:
        provider = os.environ.get("LLM_PROVIDER", "custom").strip().lower()
        return _normalize_config(
            {
                "provider": provider,
                "api_key": explicit_key,
                "model": os.environ.get("LLM_MODEL", ""),
                "base_url": os.environ.get("LLM_BASE_URL", ""),
            },
            "environment",
        )

    for provider, env_names in _ENV_KEYS.items():
        for env_name in env_names:
            key = os.environ.get(env_name, "").strip()
            if key:
                return _normalize_config(
                    {
                        "provider": provider,
                        "api_key": key,
                        "model": os.environ.get("LLM_MODEL", ""),
                        "base_url": os.environ.get("LLM_BASE_URL", ""),
                    },
                    "environment",
                )
    return None


def is_configured() -> bool:
    return get_active_config() is not None


def get_status() -> Dict[str, Any]:
    config = get_active_config()
    if not config:
        return {
            "configured": False,
            "provider": None,
            "provider_label": None,
            "model": None,
            "base_url": None,
            "key_hint": None,
            "source": None,
            "verified": False,
        }

    key = config.get("api_key", "")
    hint = f"••••{key[-4:]}" if len(key) >= 8 else ("set" if key else "not required")
    provider = config.get("provider", "custom")
    return {
        "configured": True,
        "provider": provider,
        "provider_label": PROVIDER_PRESETS.get(provider, {}).get("label", provider.title()),
        "model": config.get("model"),
        "base_url": config.get("base_url"),
        "key_hint": hint,
        "source": config.get("source"),
        "verified": bool(config.get("verified")),
    }


def get_provider_presets() -> List[Dict[str, Any]]:
    return [
        {
            "id": provider_id,
            "label": preset["label"],
            "base_url": preset["base_url"],
            "model": preset["model"],
            "signup_url": preset["signup_url"],
            "note": preset["note"],
        }
        for provider_id, preset in PROVIDER_PRESETS.items()
    ]


def _request_chat(config: Dict[str, Any], payload: Dict[str, Any], timeout: int) -> Dict[str, Any]:
    base_url = _clean_base_url(config.get("base_url"))
    if not base_url:
        raise LLMProviderError("A base URL is required for this provider.")
    if not base_url.startswith(("http://", "https://")):
        raise LLMProviderError("The base URL must start with http:// or https://")

    headers = {"Content-Type": "application/json"}
    api_key = config.get("api_key")
    if api_key:
        headers["Authorization"] = f"Bearer {api_key}"
    if config.get("provider") == "openrouter":
        headers["HTTP-Referer"] = "http://localhost:5173"
        headers["X-Title"] = "MedVision AI"

    try:
        response = requests.post(
            f"{base_url}/chat/completions",
            headers=headers,
            json=payload,
            timeout=timeout,
        )
    except requests.RequestException as exc:
        raise LLMProviderError(f"Could not reach the provider: {exc}") from exc

    if response.status_code >= 400:
        detail = response.text.strip().replace("\n", " ")[:400]
        api_key = config.get("api_key")
        if api_key:
            detail = detail.replace(api_key, "[redacted]")
        raise LLMProviderError(f"Provider returned HTTP {response.status_code}: {detail}")

    try:
        return response.json()
    except ValueError as exc:
        raise LLMProviderError("Provider returned a non-JSON response.") from exc


def _gemini_flash_no_thinking(config: Dict[str, Any]) -> bool:
    base_url = str(config.get("base_url") or "").lower()
    model = str(config.get("model") or "").lower()
    return (
        "generativelanguage.googleapis.com" in base_url
        and "gemini-2.5-flash" in model
        and "pro" not in model
    )


def chat_completion(
    messages: List[Dict[str, str]],
    *,
    json_mode: bool = False,
    temperature: float = 0.3,
    max_tokens: int = 1200,
    timeout: int = 60,
    config: Optional[Dict[str, Any]] = None,
) -> Optional[Dict[str, Any]]:
    active = config or get_active_config()
    if not active:
        return None

    payload: Dict[str, Any] = {
        "model": active.get("model"),
        "messages": messages,
        "temperature": temperature,
        "max_tokens": max_tokens,
        "stream": False,
    }
    if json_mode:
        payload["response_format"] = {"type": "json_object"}
    if _gemini_flash_no_thinking(active):
        payload["reasoning_effort"] = "none"

    try:
        data = _request_chat(active, payload, timeout)
    except LLMProviderError:
        if not json_mode:
            raise
        payload.pop("response_format", None)
        data = _request_chat(active, payload, timeout)

    choices = data.get("choices") or []
    if not choices:
        raise LLMProviderError("Provider returned no choices.")

    message = choices[0].get("message") or {}
    content = str(message.get("content") or "").strip()
    if not content:
        finish_reason = choices[0].get("finish_reason")
        usage = data.get("usage") or {}
        details = usage.get("completion_tokens_details") or {}
        reasoning_tokens = details.get("reasoning_tokens")
        hint = ""
        if finish_reason == "length" or reasoning_tokens:
            hint = " The provider probably used the entire output budget on reasoning. Retry with a non-thinking model or a larger token budget."
        raise LLMProviderError(
            f"Provider returned no text (finish_reason={finish_reason or 'unknown'}).{hint}"
        )

    return {
        "content": content,
        "model": data.get("model") or active.get("model"),
        "provider": active.get("provider"),
        "usage": data.get("usage") or {},
    }


def parse_json_object(text: str) -> Dict[str, Any]:
    cleaned = str(text or "").strip()
    if cleaned.startswith("```"):
        parts = cleaned.split("```")
        cleaned = parts[1] if len(parts) > 1 else cleaned
        if cleaned.startswith("json"):
            cleaned = cleaned[4:]
        cleaned = cleaned.strip()

    try:
        parsed = json.loads(cleaned)
        if isinstance(parsed, dict):
            return parsed
    except ValueError:
        pass

    start = cleaned.find("{")
    end = cleaned.rfind("}")
    if start != -1 and end > start:
        parsed = json.loads(cleaned[start : end + 1])
        if isinstance(parsed, dict):
            return parsed
    raise ValueError("The model did not return a JSON object.")


def configure_provider(
    provider: str,
    api_key: str = "",
    model: str = "",
    base_url: str = "",
    verify: bool = True,
) -> Dict[str, Any]:
    provider = str(provider or "").strip().lower()
    if provider not in PROVIDER_PRESETS:
        raise ValueError("Choose a supported provider.")

    preset = PROVIDER_PRESETS[provider]
    normalized = _normalize_config(
        {
            "provider": provider,
            "api_key": api_key,
            "model": model,
            "base_url": base_url,
        },
        "runtime",
    )

    if not normalized["model"]:
        raise ValueError("Enter a model name.")
    if not normalized["base_url"]:
        raise ValueError("Enter the provider's OpenAI-compatible base URL.")
    if provider != "custom" and not normalized["api_key"]:
        raise ValueError("Paste the API key from your provider.")

    if verify:
        test_connection(normalized)

    normalized["verified"] = True
    with _LOCK:
        _RUNTIME_CONFIG.clear()
        _RUNTIME_CONFIG.update(normalized)
    return get_status()


def test_connection(config: Optional[Dict[str, Any]] = None) -> str:
    active = config or get_active_config()
    if not active:
        raise LLMProviderError("No API key is configured yet.")

    result = chat_completion(
        [
            {
                "role": "system",
                "content": "You are a connection test. Reply with exactly: OK",
            },
            {"role": "user", "content": "Reply with OK."},
        ],
        temperature=0,
        max_tokens=2048,
        timeout=30,
        config=active,
    )
    if not result or not result.get("content"):
        raise LLMProviderError("The provider did not return a response.")
    return f"Connected to {result.get('provider', 'provider')} · {result.get('model', 'model')}."


def clear_provider() -> None:
    with _LOCK:
        _RUNTIME_CONFIG.clear()
