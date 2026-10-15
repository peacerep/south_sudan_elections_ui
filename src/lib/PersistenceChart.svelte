<script>
  export let data;

  const definitions = [
    { id: 'elections_hopeful', label: 'Hopeful', categories: new Set(['Agree', 'Strongly agree']), colour: '#0B5740' },
    { id: 'elections_afraid', label: 'Afraid', categories: new Set(['Agree', 'Strongly agree']), colour: '#AC4399' },
    { id: 'election_violence_risk', label: 'Violence risk', categories: new Set(['Somehow high', 'Very high']), colour: '#DF1F36' }
  ];
  const years = { 1: 2021, 2: 2022, 3: 2022, 4: 2023, 5: 2024, 6: 2025, 7: 2026 };
  const plot = { left: 62, right: 700, top: 22, bottom: 240 };
  const x = (wave) => plot.left + ((wave - 1) / 6) * (plot.right - plot.left);
  const y = (value) => plot.bottom - (value / 100) * (plot.bottom - plot.top);
  const series = definitions.map((definition) => {
    const rows = data.results.filter((row) => row.measure_id === definition.id);
    const waves = [...new Set(rows.map((row) => row.wave))].sort((a, b) => a - b);
    const points = waves.map((wave) => {
      const waveRows = rows.filter((row) => row.wave === wave);
      return {
        wave,
        value: waveRows
          .filter((row) => definition.categories.has(row.category))
          .reduce((sum, row) => sum + row.percentage_valid, 0)
      };
    });
    return { ...definition, points, polyline: points.map((point) => `${x(point.wave)},${y(point.value)}`).join(' ') };
  });
</script>

<figure class="persistence-chart" aria-labelledby="persistence-title">
  <figcaption id="persistence-title">
    <strong>The pattern has persisted over time</strong>
    <span>Hope and fear: agree or strongly agree<br>Violence risk: somehow high or very high</span>
  </figcaption>
  <div class="series-legend">
    {#each series as item}<span style={`--legend-colour: ${item.colour}`}><i></i>{item.label}</span>{/each}
  </div>
  <svg viewBox="0 0 720 300" role="img" aria-label="Percent agreeing or strongly agreeing about election hope and fear, and assessing election violence risk as somehow or very high, across survey waves">
    {#each [0, 25, 50, 75, 100] as tick}
      <line class="gridline" x1={plot.left} y1={y(tick)} x2={plot.right} y2={y(tick)}></line>
      <text class="axis-label" x={plot.left - 12} y={y(tick) + 4} text-anchor="end">{tick}%</text>
    {/each}
    {#each [1, 2, 3, 4, 5, 6, 7] as wave}
      <text class="wave-label" x={x(wave)} y="268" text-anchor="middle"><tspan x={x(wave)}>Wave {wave}</tspan><tspan x={x(wave)} dy="15">({years[wave]})</tspan></text>
    {/each}
    {#each series as item}
      <polyline points={item.polyline} style={`--series-colour: ${item.colour}`}></polyline>
      {#each item.points as point}
        <circle cx={x(point.wave)} cy={y(point.value)} r="5" style={`--series-colour: ${item.colour}`}><title>{item.label}, Wave {point.wave} ({years[point.wave]}): {point.value.toFixed(1)}%</title></circle>
      {/each}
    {/each}
  </svg>
</figure>
