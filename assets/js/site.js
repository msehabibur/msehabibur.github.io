// Minimal client-side search over a small static index (title + url + summary).
async function loadIndex() {
  if (window._siteIndex) return window._siteIndex;
  try {
    const res = await fetch('/assets/search/index.json');
    window._siteIndex = await res.json();
    return window._siteIndex;
  } catch (e) {
    console.warn('Search index missing:', e);
    window._siteIndex = [];
    return [];
  }
}
window.siteSearch = async function(q) {
  const box = document.getElementById('q-results');
  if (!q || q.trim().length < 2) { box.style.display='none'; box.innerHTML=''; return; }
  const idx = await loadIndex();
  const qq = q.toLowerCase();
  const hits = idx.filter(x =>
    (x.title||'').toLowerCase().includes(qq) ||
    (x.summary||'').toLowerCase().includes(qq)
  ).slice(0,12);
  if (!hits.length) { box.innerHTML = '<div style="padding:8px 10px;color:#777">No results</div>'; box.style.display='block'; return; }
  box.innerHTML = hits.map(h => `<a href="${h.url}"><strong>${h.title}</strong><br><span style="font-size:12px;color:#666">${h.summary||''}</span></a>`).join('');
  box.style.display = 'block';
};
document.addEventListener('click', (e)=>{
  const box = document.getElementById('q-results');
  if (!box) return;
  if (!e.target.closest('.searchbox')) { box.style.display='none'; }
});
