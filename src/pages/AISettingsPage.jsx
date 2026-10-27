import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  Cpu,
  ExternalLink,
  Eye,
  EyeOff,
  KeyRound,
  Loader2,
  Lock,
  RefreshCw,
  Server,
  Trash2,
} from 'lucide-react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import { clearLLMConfig, getLLMConfig, saveLLMConfig } from '../services/api';
import { useToast } from '../context/ToastContext';

const KEY_SOURCES = [
  {
    id: 'groq',
    label: 'Groq',
    url: 'https://console.groq.com/keys',
    note: 'Free tier and fast Llama models. Best first choice for this demo.',
  },
  {
    id: 'gemini',
    label: 'Google Gemini',
    url: 'https://aistudio.google.com/apikey',
    note: 'Free tier in Google AI Studio, using the OpenAI-compatible endpoint.',
  },
  {
    id: 'openrouter',
    label: 'OpenRouter',
    url: 'https://openrouter.ai/keys',
    note: 'One key for many models. Free models vary in availability.',
  },
  {
    id: 'openai',
    label: 'OpenAI',
    url: 'https://platform.openai.com/api-keys',
    note: 'Paid API. Use a project key with a small spending limit.',
  },
];

const inputClass =
  'w-full rounded-md border border-line bg-paper px-3 py-2.5 text-sm text-ink placeholder:text-muted/70 transition-colors focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/15';

export default function AISettingsPage() {
  const { addToast } = useToast();
  const [status, setStatus] = useState(null);
  const [providers, setProviders] = useState([]);
  const [ollama, setOllama] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [saving, setSaving] = useState(false);
  const [clearing, setClearing] = useState(false);
  const [showKey, setShowKey] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    provider: 'groq',
    apiKey: '',
    model: '',
    baseUrl: '',
  });

  function applyConfigData(data) {
    const nextStatus = data.status || {};
    const nextProviders = data.providers || [];
    setStatus(nextStatus);
    setProviders(nextProviders);
    setOllama(data.ollama || null);
    setLoadError('');

    const fallback = nextProviders.find((item) => item.id === 'groq') || nextProviders[0];
    if (nextStatus.configured) {
      setForm({
        provider: nextStatus.provider || fallback?.id || 'groq',
        apiKey: '',
        model: nextStatus.model || fallback?.model || '',
        baseUrl: nextStatus.base_url || fallback?.base_url || '',
      });
    } else if (fallback) {
      setForm({
        provider: fallback.id,
        apiKey: '',
        model: fallback.model,
        baseUrl: fallback.base_url,
      });
    }
  }

  async function loadConfig() {
    setLoading(true);
    setLoadError('');
    try {
      applyConfigData(await getLLMConfig());
    } catch (err) {
      setLoadError(
        err.response?.data?.detail ||
          'The backend is not reachable. Start FastAPI on port 8000, then refresh.'
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    let cancelled = false;
    getLLMConfig()
      .then((data) => {
        if (!cancelled) applyConfigData(data);
      })
      .catch((err) => {
        if (!cancelled) {
          setLoadError(
            err.response?.data?.detail ||
              'The backend is not reachable. Start FastAPI on port 8000, then refresh.'
          );
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const selectedPreset = providers.find((item) => item.id === form.provider);

  function chooseProvider(providerId) {
    const preset = providers.find((item) => item.id === providerId);
    setError('');
    setForm((prev) => ({
      ...prev,
      provider: providerId,
      apiKey: prev.provider === providerId ? prev.apiKey : '',
      model: preset?.model || '',
      baseUrl: preset?.base_url || '',
    }));
  }

  async function handleSave(event) {
    event.preventDefault();
    setError('');

    if (form.provider !== 'custom' && !form.apiKey.trim()) {
      setError('Paste an API key first.');
      return;
    }
    if (!form.model.trim()) {
      setError('Enter the model name.');
      return;
    }
    if (!form.baseUrl.trim()) {
      setError('Enter the OpenAI-compatible base URL.');
      return;
    }

    setSaving(true);
    try {
      const data = await saveLLMConfig({
        provider: form.provider,
        api_key: form.apiKey.trim(),
        model: form.model.trim(),
        base_url: form.baseUrl.trim(),
        verify: true,
      });
      setStatus(data.status || null);
      setForm((prev) => ({ ...prev, apiKey: '' }));
      setShowKey(false);
      addToast(data.message || 'Provider connected for this session.', 'success');
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          'The provider rejected the connection. Check the key, model, and base URL.'
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleClear() {
    setError('');
    setClearing(true);
    try {
      const data = await clearLLMConfig();
      setStatus(data.status || null);
      if (data.status?.configured) {
        addToast(data.message, 'info');
      } else {
        addToast(data.message, 'success');
        await loadConfig();
      }
    } catch (err) {
      setError(err.response?.data?.detail || 'Could not clear the key.');
    } finally {
      setClearing(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="max-w-xl">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-accent">
            Hidden settings
          </p>
          <h1 className="mt-2 font-display text-3xl tracking-tight text-ink sm:text-4xl">
            AI provider
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-ink-soft">
            Add an OpenAI-compatible API key to power report analysis, diet chat,
            and video narration. Without a key, MedVision uses local Ollama or its
            built-in rules.
          </p>
        </div>
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-sm text-muted transition-colors hover:bg-paper-deep hover:text-ink"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Link>
      </div>

      {loading ? (
        <Card className="mt-8 flex items-center gap-3 text-sm text-muted">
          <Loader2 className="h-4 w-4 animate-spin text-accent" />
          Checking the backend and provider status...
        </Card>
      ) : loadError ? (
        <Card className="mt-8 border-danger/30 bg-danger/5">
          <div className="flex items-start gap-3">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-danger" />
            <div className="min-w-0">
              <p className="text-sm font-semibold text-ink">Backend unavailable</p>
              <p className="mt-1 text-sm leading-relaxed text-ink-soft">{loadError}</p>
              <Button
                variant="outline"
                size="sm"
                className="mt-3"
                icon={RefreshCw}
                onClick={loadConfig}
              >
                Try again
              </Button>
            </div>
          </div>
        </Card>
      ) : (
        <>
          <Card className="mt-8">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <span
                  className={`grid h-10 w-10 shrink-0 place-items-center rounded-md ${
                    status?.configured
                      ? 'bg-accent-soft text-accent-deep'
                      : 'bg-paper-deep text-muted'
                  }`}
                >
                  <Server className="h-5 w-5" />
                </span>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-semibold text-ink">
                      {status?.configured
                        ? `${status.provider_label} connected`
                        : 'No API provider configured'}
                    </p>
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium ${
                        status?.configured
                          ? 'bg-accent-soft text-accent-deep'
                          : 'bg-paper-deep text-muted'
                      }`}
                    >
                      {status?.configured ? (
                        <CheckCircle2 className="h-3 w-3" />
                      ) : (
                        <Lock className="h-3 w-3" />
                      )}
                      {status?.configured ? 'Session active' : 'Local fallback'}
                    </span>
                  </div>
                  <p className="mt-1 break-words text-sm text-ink-soft">
                    {status?.configured
                      ? `${status.model} · key ${status.key_hint}`
                      : 'Report analysis, diet chat, and video narration will use Ollama or the built-in rules.'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  icon={RefreshCw}
                  onClick={loadConfig}
                >
                  Refresh
                </Button>
                {status?.configured && (
                  <Button
                    variant="ghost"
                    size="sm"
                    icon={Trash2}
                    isLoading={clearing}
                    onClick={handleClear}
                  >
                    Clear
                  </Button>
                )}
              </div>
            </div>

            <div className="mt-5 grid gap-3 border-t border-line pt-4 text-xs text-muted sm:grid-cols-2">
              <div className="flex items-start gap-2">
                <KeyRound className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                <span>
                  Key source:{' '}
                  <span className="text-ink-soft">
                    {status?.source === 'environment'
                      ? 'backend environment'
                      : status?.configured
                        ? 'this backend session'
                        : 'none'}
                  </span>
                </span>
              </div>
              <div className="flex items-start gap-2">
                <Cpu className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                <span>
                  Local Ollama:{' '}
                  <span className="text-ink-soft">
                    {ollama?.available
                      ? ollama.has_model
                        ? `running with ${ollama.model_name}`
                        : `running; ${ollama.model_name} not installed`
                      : 'not reachable'}
                  </span>
                </span>
              </div>
            </div>
          </Card>

          <Card className="mt-5">
            <form onSubmit={handleSave} className="space-y-5">
              <div>
                <p className="text-sm font-semibold text-ink">Choose a provider</p>
                <p className="mt-1 text-xs leading-relaxed text-muted">
                  All options below use an OpenAI-compatible API. Groq is the
                  quickest free option.
                </p>
                <div className="mt-3 grid gap-2 sm:grid-cols-2">
                  {providers.map((provider) => {
                    const active = form.provider === provider.id;
                    return (
                      <button
                        key={provider.id}
                        type="button"
                        onClick={() => chooseProvider(provider.id)}
                        className={`rounded-md border px-3 py-2.5 text-left transition-colors ${
                          active
                            ? 'border-accent bg-accent-soft/60 text-ink'
                            : 'border-line bg-paper text-ink-soft hover:border-muted/60 hover:bg-paper-deep'
                        }`}
                      >
                        <span className="flex items-center justify-between gap-2 text-sm font-medium">
                          {provider.label}
                          {provider.id === 'groq' && (
                            <span className="rounded-full bg-surface px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-accent-deep">
                              Recommended
                            </span>
                          )}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="llm-api-key"
                    className="mb-1.5 flex items-center justify-between text-xs font-medium text-ink-soft"
                  >
                    <span>API key</span>
                    <span className="inline-flex items-center gap-1 text-muted">
                      <Lock className="h-3 w-3" />
                      hidden
                    </span>
                  </label>
                  <div className="relative">
                    <input
                      id="llm-api-key"
                      type={showKey ? 'text' : 'password'}
                      value={form.apiKey}
                      onChange={(event) =>
                        setForm((prev) => ({ ...prev, apiKey: event.target.value }))
                      }
                      autoComplete="off"
                      spellCheck={false}
                      placeholder={
                        form.provider === 'custom'
                          ? 'Optional for a local gateway'
                          : 'Paste the key from your provider'
                      }
                      className={`${inputClass} pr-10 font-mono`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowKey((prev) => !prev)}
                      className="absolute right-1.5 top-1/2 grid h-7 w-7 -translate-y-1/2 place-items-center rounded text-muted transition-colors hover:bg-paper-deep hover:text-ink"
                      aria-label={showKey ? 'Hide API key' : 'Show API key'}
                    >
                      {showKey ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  {selectedPreset?.signup_url ? (
                    <a
                      href={selectedPreset.signup_url}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-1.5 inline-flex items-center gap-1 text-xs font-medium text-accent transition-colors hover:text-accent-deep"
                    >
                      Get a {selectedPreset.label} key
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  ) : (
                    <p className="mt-1.5 text-xs text-muted">
                      No key needed for a local OpenAI-compatible gateway.
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="llm-model"
                    className="mb-1.5 block text-xs font-medium text-ink-soft"
                  >
                    Model
                  </label>
                  <input
                    id="llm-model"
                    type="text"
                    value={form.model}
                    onChange={(event) =>
                      setForm((prev) => ({ ...prev, model: event.target.value }))
                    }
                    placeholder="Model name"
                    className={`${inputClass} font-mono`}
                  />
                  <p className="mt-1.5 text-xs text-muted">
                    Edit this if the provider retires or renames the model.
                  </p>
                </div>
              </div>

              <div>
                <label
                  htmlFor="llm-base-url"
                  className="mb-1.5 block text-xs font-medium text-ink-soft"
                >
                  Base URL
                </label>
                <input
                  id="llm-base-url"
                  type="url"
                  value={form.baseUrl}
                  onChange={(event) =>
                    setForm((prev) => ({ ...prev, baseUrl: event.target.value }))
                  }
                  placeholder="https://api.example.com/v1"
                  className={`${inputClass} font-mono`}
                />
                <p className="mt-1.5 text-xs text-muted">
                  MedVision calls <span className="font-mono">POST /chat/completions</span>{' '}
                  on this URL.
                </p>
              </div>

              {error && (
                <div
                  role="alert"
                  className="flex items-start gap-2 rounded-md border border-danger/25 bg-danger/5 px-3 py-2.5 text-xs leading-relaxed text-danger"
                >
                  <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line pt-4">
                <p className="max-w-sm text-xs leading-relaxed text-muted">
                  The key is kept in backend memory only. It is never returned to
                  the browser or written to disk, and it is cleared on restart.
                  This page is a local demo control, not account authentication.
                </p>
                <Button type="submit" icon={KeyRound} isLoading={saving}>
                  Test and save
                </Button>
              </div>
            </form>
          </Card>

          <div className="mt-8">
            <h2 className="font-display text-xl tracking-tight text-ink">
              Where to get a key
            </h2>
            <p className="mt-1 text-sm text-ink-soft">
              Create an account, generate a key, and paste it above.
            </p>
            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              {KEY_SOURCES.map((source) => (
                <a
                  key={source.id}
                  href={source.url}
                  target="_blank"
                  rel="noreferrer"
                  className="group rounded-md border border-line bg-surface px-4 py-3 transition-colors hover:border-muted/60 hover:bg-paper"
                >
                  <span className="flex items-center justify-between gap-2 text-sm font-medium text-ink">
                    {source.label}
                    <ExternalLink className="h-3.5 w-3.5 text-muted transition-colors group-hover:text-accent" />
                  </span>
                  <span className="mt-1 block text-xs leading-relaxed text-muted">
                    {source.note}
                  </span>
                </a>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
