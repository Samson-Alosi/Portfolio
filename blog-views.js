(function () {
  function getConfig() {
    const config = window.SUPABASE_CONFIG || {};
    if (!config.url || !config.publishableKey) {
      throw new Error('Supabase is not configured.');
    }
    return config;
  }

  function requestHeaders() {
    const config = getConfig();
    return {
      apikey: config.publishableKey,
      'Content-Type': 'application/json'
    };
  }

  async function getCounts(slugs = []) {
    const config = getConfig();
    const response = await fetch(`${config.url}/rest/v1/post_views?select=post_slug,view_count`, {
      headers: requestHeaders()
    });
    if (!response.ok) throw new Error('Unable to load blog views.');

    const rows = await response.json();
    const counts = Object.fromEntries(rows.map(row => [row.post_slug, Number(row.view_count)]));
    slugs.forEach(slug => {
      if (slug) counts[slug] = counts[slug] || 0;
    });
    return counts;
  }

  async function increment(slug) {
    const config = getConfig();
    const response = await fetch(`${config.url}/rest/v1/rpc/increment_post_view`, {
      method: 'POST',
      headers: requestHeaders(),
      body: JSON.stringify({ p_post_slug: slug })
    });
    if (!response.ok) throw new Error('Unable to record blog view.');

    return Number(await response.json());
  }

  function renderCount(element, count) {
    if (!element || !Number.isFinite(count)) return;
    const value = element.querySelector('[data-view-count-value]');
    if (!value) return;
    value.textContent = `${new Intl.NumberFormat().format(count)} ${count === 1 ? 'view' : 'views'}`;
    element.hidden = false;
  }

  window.BlogViews = { getCounts, increment, renderCount };
})();