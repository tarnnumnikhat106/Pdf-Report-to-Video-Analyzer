export function formatReportName(name, fallback = 'Medical report analysis') {
  if (!name) return fallback;

  const withoutExtension = String(name).replace(/\.[a-z0-9]+$/i, '');
  const cleaned = withoutExtension.replace(/[_-]+/g, ' ').replace(/\s+/g, ' ').trim();

  return cleaned || fallback;
}
