<script>
  export let data;
  let view = 'all';
  const years = { 1: 2021, 2: 2022, 3: 2022, 4: 2023, 5: 2024, 6: 2025, 7: 2026 };
  const definitions = [
    { measureId: 'elections_hopeful', label: 'Elections make me feel hopeful about the future of South Sudan', categories: new Set(['Agree', 'Strongly agree']), colour: '#0B5740' },
    { measureId: 'elections_afraid', label: 'Elections make me feel afraid about the future of South Sudan', categories: new Set(['Agree', 'Strongly agree']), colour: '#AC4399' },
    { measureId: 'election_violence_risk', label: 'The risk of violence in relation to elections is high', categories: new Set(['Somehow high', 'Very high']), colour: '#DF1F36' }
  ];
  const stats = definitions.map((definition) => {
    const rows = data.results.filter((row) => row.measure_id === definition.measureId);
    const waves = [...new Set(rows.map((row) => row.wave))].sort((a, b) => a - b);
    const series = waves.map((wave) => {
      const periodRows = rows.filter((row) => row.wave === wave);
      return { wave, year: years[wave], period: periodRows[0].fieldwork_dates, value: periodRows.filter((row) => definition.categories.has(row.category)).reduce((sum, row) => sum + row.percentage_valid, 0), validN: periodRows[0].valid_n };
    });
    const numerator = rows.filter((row) => definition.categories.has(row.category)).reduce((sum, row) => sum + row.numerator, 0);
    const validN = waves.reduce((sum, wave) => sum + rows.find((row) => row.wave === wave).valid_n, 0);
    return { ...definition, series, allValue: 100 * numerator / validN, validN };
  });
  const plot = { left: 52, right: 704, top: 20, bottom: 174 };
  const x = (index, count) => count === 1 ? (plot.left + plot.right) / 2 : plot.left + index * (plot.right - plot.left) / (count - 1);
  const y = (value) => plot.bottom - value / 100 * (plot.bottom - plot.top);
  const points = (series) => series.map((point, index) => `${x(index, series.length)},${y(point.value)}`).join(' ');
</script>

<figure class="lollipop-summary" aria-labelledby="all-wave-comparison-title">
  <figcaption id="all-wave-comparison-title"><strong>All survey waves</strong><span>2021–2026</span></figcaption>
  <p class="summary-response-key"><strong>How to read these figures:</strong> hope and fear show the share who agreed or strongly agreed; violence risk shows the share who answered somehow high or very high.</p>
  <div class="summary-tabs" role="tablist" aria-label="Choose time view">
    <button role="tab" aria-selected={view === 'all'} class:active={view === 'all'} on:click={() => view = 'all'}>All survey waves</button>
    <button role="tab" aria-selected={view === 'history'} class:active={view === 'history'} on:click={() => view = 'history'}>Show per survey wave</button>
  </div>
  {#if view === 'all'}
    <div class="lollipop-axis" aria-hidden="true"><span></span><div><i>0</i><i>25</i><i>50</i><i>75</i><i>100%</i></div><span></span></div>
    {#each stats as stat}
      <div class="lollipop-row" style={`--stat-colour: ${stat.colour}; --value: ${stat.allValue}%`}>
        <div class="lollipop-label"><strong>{stat.label}</strong><span>{stat.validN.toLocaleString()} responses counted across the available waves</span></div>
        <div class="lollipop-plot" aria-hidden="true"><span class="lollipop-fill"></span><span class="lollipop-dot"></span></div>
        <strong class="lollipop-value">{stat.allValue.toFixed(1)}%</strong>
      </div>
    {/each}
  {:else}
    <div class="summary-trends">
      {#each stats as stat}
        <section style={`--stat-colour:${stat.colour}`}>
          <h3>{stat.label}</h3>
          <svg viewBox="0 0 720 225" role="img" aria-label={`${stat.label} across ${stat.series.length} survey waves`}>
            {#each [0, 25, 50, 75, 100] as tick}<line x1={plot.left} y1={y(tick)} x2={plot.right} y2={y(tick)}></line><text x={plot.left - 10} y={y(tick) + 4} text-anchor="end">{tick}%</text>{/each}
            <polyline points={points(stat.series)}></polyline>
            {#each stat.series as point, index}<circle cx={x(index, stat.series.length)} cy={y(point.value)} r="5"></circle><text class="trend-value" x={x(index, stat.series.length)} y={y(point.value) - 11} text-anchor="middle">{point.value.toFixed(0)}%</text><text x={x(index, stat.series.length)} y="202" text-anchor="middle"><tspan x={x(index, stat.series.length)}>Wave {point.wave}</tspan><tspan x={x(index, stat.series.length)} dy="13">{point.year}</tspan></text>{/each}
          </svg>
        </section>
      {/each}
    </div>
  {/if}
</figure>
