---
layout: default
title: Data & Tools
---

# Data & Tools

- **Streamlit App:** <a href="https://aiforsemiconductors.streamlit.app/" target="_blank">AI for Semiconductors</a>  
- **Defect GNN (code):** <a href="https://github.com/msehabibur/defect_GNN_gen_1" target="_blank">GitHub</a>  
- **nanoHUB tool:** <a href="https://nanohub.org/tools/cadetff/" target="_blank">CADET-FF</a>

## Datasets (CSV)

Place your CSV at `assets/data/merged_data.csv`. The table below will load it automatically.

<table id="dataTable" class="display" style="width:100%"></table>

<script>
$(async function() {
  try {
    const csvUrl = "{{ '/assets/data/merged_data.csv' | relative_url }}";
    const text = await $.get(csvUrl);
    // Simple CSV parse
    const lines = text.trim().split(/\r?\n/);
    const headers = lines[0].split(',');
    const rows = lines.slice(1).map(l => l.split(','));
    $('#dataTable').DataTable({
      data: rows,
      columns: headers.map(h => ({ title: h })),
      pageLength: 25,
      deferRender: true
    });
  } catch (e) {
    $('#dataTable').after('<p class="small">CSV not found yet. Add it at <code>assets/data/merged_data.csv</code>.</p>');
  }
});
</script>
