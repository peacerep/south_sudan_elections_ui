<script>
  import catalogue from '../lib/data/election-catalogue.json';
  let query = '';
  let topic = 'All topics';
  const firstStoryColumns = new Set(['Elections_Hopeful', 'Elections_Afraid', 'Election_Violence']);
  const displayCatalogue = catalogue.filter((row) => !String(row.column_name).endsWith('_N'));
  const topics = ['All topics', ...new Set(displayCatalogue.map((row) => row.topic || 'Other'))].sort();
  $: normalizedQuery = query.trim().toLowerCase();
  $: visible = displayCatalogue.filter((row) => {
    const matchesTopic = topic === 'All topics' || (row.topic || 'Other') === topic;
    const haystack = `${row.question || ''} ${row.column_name || ''} ${row.topic || ''}`.toLowerCase();
    return matchesTopic && (!normalizedQuery || haystack.includes(normalizedQuery));
  });
  const waveLabel = (row) => {
    const waves = (row.waves_available || []).map((value) => value.match(/^W(\d)_/)?.[1]).filter(Boolean);
    const years = { 1: 2021, 2: 2022, 3: 2022, 4: 2023, 5: 2024, 6: 2025, 7: 2026 };
    return waves.length ? waves.map((wave) => `W${wave} (${years[wave]})`).join(', ') : 'Wave availability under review';
  };
</script>

<section class="catalogue-hero">
  <p class="eyebrow"><a href="/">Election picture</a> · Question explorer</p>
  <h1>Explore election questions across seven survey waves</h1>
  <p class="lede">Search the audited catalogue to see exactly what respondents were asked, when each question appeared and whether a chart is currently available.</p>
</section>

<section class="catalogue-section" aria-labelledby="catalogue-title">
  <div class="catalogue-heading"><div><p class="section-number">Question catalogue</p><h2 id="catalogue-title">{visible.length} questions and response fields</h2></div><p>Numeric scale companions are hidden from this public list; their values remain part of the evidence contract.</p></div>
  <div class="catalogue-controls">
    <label>Search questions<input type="search" bind:value={query} placeholder="e.g. violence, readiness, party vision" /></label>
    <label>Topic<select bind:value={topic}>{#each topics as item}<option>{item}</option>{/each}</select></label>
  </div>
  <div class="question-list" aria-live="polite">
    {#each visible as row}
      <article class={firstStoryColumns.has(row.column_name) ? 'has-chart' : ''}>
        <div class="question-meta"><span>{row.topic || 'Other'}</span><span>{waveLabel(row)}</span></div>
        <h3>{row.question || row.column_name}</h3>
        <details><summary>Question evidence</summary><dl><div><dt>Data field</dt><dd><code>{row.column_name}</code></dd></div><div><dt>Availability</dt><dd>{waveLabel(row)}</dd></div><div><dt>Audit status</dt><dd>{row.review_status.replaceAll('_', ' ')}</dd></div></dl></details>
        {#if firstStoryColumns.has(row.column_name)}<a class="question-chart-link" href="/trends/#saying">View this question over time →</a>{:else}<p class="catalogue-status">Catalogue entry · analysis view not yet published</p>{/if}
      </article>
    {:else}<p class="empty-result">No questions match this search.</p>{/each}
  </div>
</section>
