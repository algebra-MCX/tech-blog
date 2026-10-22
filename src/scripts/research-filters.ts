import { researchCategoryIds } from '@/data/research';

document.querySelectorAll<HTMLElement>('[data-research-browser]').forEach(browser => {
  const buttons = [...browser.querySelectorAll<HTMLButtonElement>('[data-research-category]')];
  const grid = browser.querySelector<HTMLElement>('[data-research-results]');
  const stage = browser.querySelector<HTMLElement>('[data-research-stage]');
  const rows = [...browser.querySelectorAll<HTMLElement>('[data-research-item]')];
  const role = browser.querySelector<HTMLSelectElement>('[data-research-role]');
  const empty = browser.querySelector<HTMLElement>('[data-research-empty]');
  const count = browser.querySelector<HTMLElement>('[data-research-count]');
  if (!grid) return;
  let category = 'all';
  let animations: Animation[] = [];
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const validCategory = (value: string | null) => value && (researchCategoryIds as readonly string[]).includes(value) ? value : 'all';

  function apply(animate: boolean, updateUrl: boolean) {
    const oldHeight = stage?.getBoundingClientRect().height;
    const before = new Map(rows.filter(row => !row.hidden).map(row => [row, row.getBoundingClientRect()]));
    animations.forEach(animation => animation.cancel());
    animations = [];
    rows.forEach(row => {
      row.hidden = !((category === 'all' || row.dataset.primaryCategory === category) && (!role || role.value === 'all' || row.dataset.kind === role.value));
    });
    const visible = rows.filter(row => !row.hidden);
    if (count) count.textContent = String(visible.length);
    if (empty) empty.hidden = visible.length > 0;
    buttons.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.researchCategory === category)));
    if (animate && !reduced.matches) {
      if (stage && oldHeight !== undefined) animations.push(stage.animate([{ height: `${oldHeight}px` }, { height: `${stage.getBoundingClientRect().height}px` }], { duration: 240, easing: 'cubic-bezier(.22,.61,.36,1)' }));
      visible.forEach(row => {
        const previous = before.get(row);
        const next = row.getBoundingClientRect();
        const from = previous ? { transform: `translate(${previous.left - next.left}px, ${previous.top - next.top}px)`, opacity: 1 } : { transform: 'translateY(8px)', opacity: 0 };
        animations.push(row.animate([from, { transform: 'translate(0, 0)', opacity: 1 }], { duration: 240, easing: 'cubic-bezier(.22,.61,.36,1)' }));
      });
    }
    if (updateUrl) {
      const url = new URL(location.href);
      if (category === 'all') url.searchParams.delete('category'); else url.searchParams.set('category', category);
      if (role && role.value !== 'all') url.searchParams.set('kind', role.value); else url.searchParams.delete('kind');
      history.replaceState(null, '', url);
    }
  }
  function readUrl() {
    const params = new URLSearchParams(location.search);
    category = validCategory(params.get('category'));
    if (role) role.value = ['own', 'contributor'].includes(params.get('kind') || '') ? params.get('kind')! : 'all';
    apply(false, false);
  }
  buttons.forEach(button => button.addEventListener('click', () => {
    category = validCategory(button.dataset.researchCategory || null);
    apply(true, true);
    // Scroll only the category strip, without shifting the document vertically.
    const nav = button.parentElement!;
    const bounds = button.getBoundingClientRect();
    const frame = nav.getBoundingClientRect();
    if (bounds.left < frame.left || bounds.right > frame.right) nav.scrollTo({ left: nav.scrollLeft + bounds.left - frame.left - (frame.width - bounds.width) / 2, behavior: reduced.matches ? 'instant' : 'smooth' });
  }));
  role?.addEventListener('change', () => apply(true, true));
  addEventListener('popstate', readUrl);
  const localizeRole = () => role?.querySelectorAll<HTMLOptionElement>('option').forEach(option => {
    option.textContent = (document.documentElement.lang.startsWith('zh') ? option.dataset.zh : option.dataset.en) || option.value;
  });
  new MutationObserver(localizeRole).observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
  localizeRole();
  readUrl();
});
