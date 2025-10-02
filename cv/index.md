---
layout: default
title: CV
---

# Curriculum Vitae

{% assign cv_pdf = '/assets/cv/Md_Habibur_Rahman_CV.pdf' | relative_url %}
- **Download PDF:** <a href="{{ cv_pdf }}" target="_blank">Md_Habibur_Rahman_CV.pdf</a>
  <span class="small">(Add your PDF at <code>assets/cv/Md_Habibur_Rahman_CV.pdf</code>.)</span>

<div id="cv-frame-wrapper" hidden>
  <iframe
    id="cv-frame"
    data-src="{{ cv_pdf }}"
    width="100%" height="900"
    style="border:1px solid #e8ecf2;border-radius:8px">
  </iframe>
</div>

<div id="cv-missing" class="small" hidden>
  The embedded preview will appear after you add <code>assets/cv/Md_Habibur_Rahman_CV.pdf</code>.
</div>

<script>
(async function() {
  const wrapper = document.getElementById('cv-frame-wrapper');
  const frame = document.getElementById('cv-frame');
  const missing = document.getElementById('cv-missing');
  if (!wrapper || !frame || !missing) return;
  try {
    const res = await fetch(frame.dataset.src, { method: 'HEAD' });
    if (!res.ok) throw new Error('missing');
    frame.src = frame.dataset.src;
    wrapper.hidden = false;
  } catch (err) {
    missing.hidden = false;
  }
})();
</script>
