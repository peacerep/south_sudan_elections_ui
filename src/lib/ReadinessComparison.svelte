<script>
  export let data;
  const years = { 5: 2024, 6: 2025, 7: 2026 };
  const ready = data.questions.find((question) => question.question_id === 'country_ready');
  const periods = [5, 6, 7].map((wave) => {
    const readySummary = ready.wave_summaries.find((period) => period.wave === wave);
    const timingRows = data.results.filter((row) => row.question_id === 'election_timing' && row.wave === wave && !row.is_missing);
    const timing = timingRows.sort((a, b) => b.percentage_valid - a.percentage_valid)[0];
    return { wave, year: years[wave], ready: readySummary.highlighted_percentage, timing: timing.percentage_valid, timingLabel: timing.category };
  });
</script>

<aside class="readiness-comparison" aria-labelledby="readiness-comparison-title">
  <p class="subsection-label">Timing and readiness</p>
  <h3 id="readiness-comparison-title">Wanting elections on schedule is not the same as believing the country is ready</h3>
  <p>In each of the three most recent survey waves, the most common timing answer was the scheduled election date. The share choosing that answer was also higher than the share agreeing that South Sudan was ready for elections.</p>
  <div class="readiness-comparison-chart">
    {#each periods as period}
      <section>
        <h4>{period.year}</h4>
        <div><span><i style={`width:${period.timing}%`}></i></span><p><strong>{period.timing.toFixed(1)}%</strong><small>{period.timingLabel}</small></p></div>
        <div><span><i class="ready-bar" style={`width:${period.ready}%`}></i></span><p><strong>{period.ready.toFixed(1)}%</strong><small>Agreed South Sudan was ready</small></p></div>
      </section>
    {/each}
  </div>
  <p class="comparison-caution">These questions capture different judgements. The comparison does not show that the same individuals wanted an election while believing the country was unready.</p>
</aside>
