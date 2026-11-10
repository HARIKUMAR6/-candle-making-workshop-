// Style guide only: renders live token swatches so values always match the active theme.

const render = () => {
  const css = getComputedStyle(document.documentElement);
  document.querySelectorAll('[data-swatches]').forEach((list) => {
    list.innerHTML = list.dataset.swatches.split(' ').map((name) => {
      const value = css.getPropertyValue(`--c-${name}`).trim();
      return `
        <li class="flex items-center gap-4 rounded-sm border border-line bg-surface p-2 pe-4">
          <span class="size-10 shrink-0 rounded-xs border border-line" style="background:var(--c-${name})"></span>
          <code class="text-small font-semibold text-ink">--c-${name}</code>
          <code class="ms-auto text-small text-muted">${value}</code>
        </li>`;
    }).join('');
  });
};

render();
document.addEventListener('ew:themechange', render);
