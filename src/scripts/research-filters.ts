import { researchCategoryIds, researchAreas, type ResearchArea } from '@/data/research';

document.querySelectorAll<HTMLElement>('[data-research-browser]').forEach(browser => {
  const buttons = [...browser.querySelectorAll<HTMLButtonElement>('[data-research-category]')];
  const areaNavigation = browser.querySelector<HTMLElement>('[data-research-area-navigation]');
  const areaGroups = [...browser.querySelectorAll<HTMLElement>('[data-research-area-group]')];
  const areaButtons = [...browser.querySelectorAll<HTMLButtonElement>('[data-research-area]')];
  const grid = browser.querySelector<HTMLElement>('[data-research-results]');
  const stage = browser.querySelector<HTMLElement>('[data-research-stage]');
  const rows = [...browser.querySelectorAll<HTMLElement>('[data-research-item]')];
  const role = browser.querySelector<HTMLElement>('[data-research-role]');
  const roleTrigger = role?.querySelector<HTMLButtonElement>('[data-role-trigger]');
  const roleMenu = role?.querySelector<HTMLElement>('[data-role-menu]');
  const roleChoices = [...browser.querySelectorAll<HTMLButtonElement>('[data-role-choice]')];
  const empty = browser.querySelector<HTMLElement>('[data-research-empty]');
  const count = browser.querySelector<HTMLElement>('[data-research-count]');
  if (!grid) return;
  let category = 'all';
  let area: ResearchArea | 'all' = 'all';
  let kind: 'all' | 'own' | 'contributor' = 'all';
  let animations: Animation[] = [];
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const validCategory = (value: string | null) => value && (researchCategoryIds as readonly string[]).includes(value) ? value : 'all';
  const validArea = (value: string | null) => researchAreas.find(item => item.id === value && item.category === category)?.id ?? 'all';
  function revealActiveFilters(animate = false) {
    const selected = [buttons.find(button => button.dataset.researchCategory === category), areaButtons.find(button => button.dataset.researchParent === category && button.dataset.researchArea === area)];
    selected.forEach(button => {
      if (!button) return;
      const nav = button.parentElement!;
      const bounds = button.getBoundingClientRect();
      const frame = nav.getBoundingClientRect();
      if (bounds.left < frame.left || bounds.right > frame.right) nav.scrollTo({ left: nav.scrollLeft + bounds.left - frame.left - (frame.width - bounds.width) / 2, behavior: animate && !reduced.matches ? 'smooth' : 'instant' });
    });
  }

  function apply(animate: boolean, updateUrl: boolean) {
    const oldHeight = stage?.getBoundingClientRect().height;
    const before = new Map(rows.filter(row => !row.hidden).map(row => [row, row.getBoundingClientRect()]));
    animations.forEach(animation => animation.cancel());
    animations = [];
    rows.forEach(row => {
      row.hidden = !((category === 'all' || row.dataset.primaryCategory === category) && (area === 'all' || row.dataset.researchAreas?.split('|').includes(area)) && (kind === 'all' || row.dataset.kind === kind));
    });
    const visible = rows.filter(row => !row.hidden);
    if (count) count.textContent = String(visible.length);
    if (empty) empty.hidden = visible.length > 0;
    buttons.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.researchCategory === category)));
    if (areaNavigation) areaNavigation.hidden = category === 'all';
    areaGroups.forEach(group => { group.hidden = group.dataset.researchAreaGroup !== category; });
    areaButtons.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.researchParent === category && button.dataset.researchArea === area)));
    roleChoices.forEach(choice => choice.setAttribute('aria-checked', String(choice.dataset.roleChoice === kind)));
    role?.querySelectorAll<HTMLElement>('[data-role-current]').forEach(label => { label.hidden = label.dataset.roleCurrent !== kind; });
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
      if (area === 'all') url.searchParams.delete('area'); else url.searchParams.set('area', area);
      if (role && kind !== 'all') url.searchParams.set('kind', kind); else url.searchParams.delete('kind');
      history.replaceState(null, '', url);
    }
  }
  function readUrl() {
    const params = new URLSearchParams(location.search);
    category = validCategory(params.get('category'));
    area = validArea(params.get('area'));
    const requestedKind = params.get('kind');
    kind = role && (requestedKind === 'own' || requestedKind === 'contributor') ? requestedKind : 'all';
    closeMenu();
    apply(false, false);
    revealActiveFilters();
  }
  buttons.forEach(button => button.addEventListener('click', () => {
    const nextCategory = validCategory(button.dataset.researchCategory || null);
    if (nextCategory !== category) area = 'all';
    category = nextCategory;
    apply(true, true);
    revealActiveFilters(true);
  }));
  areaButtons.forEach(button => button.addEventListener('click', () => {
    if (button.dataset.researchParent !== category) return;
    area = validArea(button.dataset.researchArea || null);
    apply(true, true);
    revealActiveFilters(true);
  }));
  function positionMenu() {
    if (!role || !roleMenu || !roleTrigger || roleMenu.hidden) return;
    roleMenu.style.setProperty('--menu-offset', '0px');
    roleMenu.style.maxHeight = '';
    const trigger = roleTrigger.getBoundingClientRect();
    const below = innerHeight - trigger.bottom - 16;
    const above = trigger.top - 16;
    const upward = below < roleMenu.scrollHeight && above > below;
    role.dataset.placement = upward ? 'top' : 'bottom';
    roleMenu.style.maxHeight = `${Math.max(44, Math.min(260, upward ? above : below))}px`;
    const bounds = roleMenu.getBoundingClientRect();
    const offset = bounds.left < 12 ? 12 - bounds.left : bounds.right > innerWidth - 12 ? innerWidth - 12 - bounds.right : 0;
    roleMenu.style.setProperty('--menu-offset', `${offset}px`);
  }
  function closeMenu(focus = false) {
    if (!roleMenu || !roleTrigger) return;
    roleMenu.hidden = true;
    roleTrigger.setAttribute('aria-expanded', 'false');
    if (focus) roleTrigger.focus({ preventScroll: true });
  }
  function openMenu(edge?: 'first' | 'last') {
    if (!roleMenu || !roleTrigger) return;
    roleMenu.hidden = false;
    roleTrigger.setAttribute('aria-expanded', 'true');
    positionMenu();
    const selected = edge === 'first' ? roleChoices[0] : edge === 'last' ? roleChoices.at(-1) : roleChoices.find(choice => choice.dataset.roleChoice === kind);
    selected?.focus({ preventScroll: true });
  }
  roleTrigger?.addEventListener('click', () => roleMenu?.hidden ? openMenu() : closeMenu());
  roleTrigger?.addEventListener('keydown', event => {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      openMenu(event.key === 'ArrowDown' ? 'first' : 'last');
    }
  });
  roleMenu?.addEventListener('keydown', event => {
    if (event.key === 'Escape' || event.key === 'Tab') {
      if (event.key === 'Escape') event.preventDefault();
      closeMenu(true);
      return;
    }
    const index = roleChoices.indexOf(document.activeElement as HTMLButtonElement);
    const next = event.key === 'ArrowDown' ? (index + 1) % roleChoices.length : event.key === 'ArrowUp' ? (index - 1 + roleChoices.length) % roleChoices.length : event.key === 'Home' ? 0 : event.key === 'End' ? roleChoices.length - 1 : -1;
    if (next >= 0) { event.preventDefault(); roleChoices[next]?.focus({ preventScroll: true }); }
  });
  roleChoices.forEach(choice => choice.addEventListener('click', () => {
    const value = choice.dataset.roleChoice;
    kind = value === 'own' || value === 'contributor' ? value : 'all';
    apply(true, true);
    closeMenu(true);
  }));
  if (role) {
    document.addEventListener('pointerdown', event => { if (!role.contains(event.target as Node)) closeMenu(); });
    addEventListener('scroll', () => closeMenu(), { passive: true });
  }
  addEventListener('resize', () => { positionMenu(); revealActiveFilters(); });
  addEventListener('mcx:language-change', () => { positionMenu(); revealActiveFilters(); });
  addEventListener('popstate', readUrl);
  readUrl();
});
