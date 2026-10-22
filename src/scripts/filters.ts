document.querySelectorAll<HTMLElement>('[data-filter-list]').forEach(root => {
  const controls = [...root.querySelectorAll<HTMLSelectElement | HTMLInputElement>('[data-filter]')];
  const rows = [...root.querySelectorAll<HTMLElement>('[data-filter-row]')];
  const picks = [...root.querySelectorAll<HTMLButtonElement>('[data-filter-pick]')];
  const apply = () => {
    let visible = 0;
    for (const row of rows) {
      row.hidden = !controls.every(control => {
        const value = control.value.trim().toLowerCase();
        if (!value || value === 'all') return true;
        const field = control.dataset.filter ?? '';
        return field === 'query' ? (row.dataset.search ?? row.textContent ?? '').normalize('NFKC').toLowerCase().includes(value.normalize('NFKC')) : (row.dataset[field] ?? '').split('|').includes(value);
      });
      if (!row.hidden) visible++;
    }
    root.querySelectorAll<HTMLElement>('[data-filter-group]').forEach(group => { group.hidden = !group.querySelector('[data-filter-row]:not([hidden])'); });
    const empty = root.querySelector<HTMLElement>('[data-filter-empty]');
    if (empty) empty.hidden = visible !== 0;
    const count = root.querySelector<HTMLElement>('[data-filter-count]');
    if (count) count.textContent = String(visible);
    picks.forEach(button => {
      const control = controls.find(item => item.dataset.filter === button.dataset.filterPick);
      button.setAttribute('aria-pressed', String(control?.value === button.dataset.value));
    });
  };
  const params = new URLSearchParams(location.search);
  for (const control of controls) {
    const requested = params.get(control.dataset.filter ?? '');
    const choices = picks.filter(button => button.dataset.filterPick === control.dataset.filter);
    if (requested && (!choices.length || choices.some(button => button.dataset.value === requested)) && (control instanceof HTMLInputElement || [...control.options].some(option => option.value === requested))) control.value = requested;
    control.addEventListener(control instanceof HTMLInputElement ? 'input' : 'change', apply);
  }
  picks.forEach(button => button.addEventListener('click', () => {
    const control = controls.find(item => item.dataset.filter === button.dataset.filterPick);
    if (!control) return;
    control.value = button.dataset.value ?? 'all';
    apply();
    const url = new URL(location.href);
    controls.forEach(item => {
      const key = item.dataset.filter;
      if (!key) return;
      if (!item.value || item.value === 'all') url.searchParams.delete(key);
      else url.searchParams.set(key, item.value);
    });
    history.replaceState(history.state, '', url);
  }));
  apply();
});
