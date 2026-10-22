const badges = [...document.querySelectorAll<HTMLAnchorElement>('[data-repository-stars]')];
const visible = new Set<HTMLAnchorElement>();
const refreshed = new Map<string, number>();
const pending = new Map<string, Promise<void>>();
const interval = 5 * 60 * 1000;
const render = (repository: string, count: number, state: string) => badges.filter(badge => badge.dataset.repositoryStars === repository).forEach(badge => {
  const text = badge.querySelector('[data-stars-count]');
  if (text) text.textContent = new Intl.NumberFormat('en', { notation: 'compact', maximumFractionDigits: 1 }).format(count);
  badge.setAttribute('aria-label', `GitHub stars · ${repository} · ${count}`);
  badge.dataset.starsState = state;
});
const refresh = async (repository: string) => {
  if (pending.has(repository)) return pending.get(repository);
  if (Date.now() - (refreshed.get(repository) ?? 0) < interval) return;
  const request = (async () => {
    refreshed.set(repository, Date.now());
    try {
      const response = await fetch(`https://api.github.com/repos/${repository}`, { headers: { Accept: 'application/vnd.github+json' }, signal: AbortSignal.timeout(5000) });
      if (!response.ok) return;
      const data = await response.json();
      if (!Number.isSafeInteger(data.stargazers_count) || data.stargazers_count < 0) return;
      render(repository, data.stargazers_count, 'live');
      try { localStorage.setItem(`mcx-stars:${repository}`, JSON.stringify({ count: data.stargazers_count, time: Date.now() })); } catch { /* Stars work without storage. */ }
    } catch { /* Retain the last known count if GitHub is unavailable. */ }
  })();
  pending.set(repository, request);
  await request;
  pending.delete(repository);
};
badges.forEach(badge => {
  const repository = badge.dataset.repositoryStars!;
  try {
    const cached = JSON.parse(localStorage.getItem(`mcx-stars:${repository}`) ?? 'null');
    if (Number.isSafeInteger(cached?.count) && cached.count >= 0 && Date.now() - cached.time < 24 * 60 * 60 * 1000) render(repository, cached.count, 'cached');
  } catch { /* The verified build-time count remains available. */ }
});
const observer = new IntersectionObserver(entries => entries.forEach(entry => {
  const badge = entry.target as HTMLAnchorElement;
  if (entry.isIntersecting) { visible.add(badge); if (!document.hidden) void refresh(badge.dataset.repositoryStars!); }
  else visible.delete(badge);
}));
badges.forEach(badge => observer.observe(badge));
const updateVisible = () => { if (!document.hidden) visible.forEach(badge => void refresh(badge.dataset.repositoryStars!)); };
window.setInterval(updateVisible, interval);
document.addEventListener('visibilitychange', updateVisible);
