<script>
  export let results;
  export let measure;
  export let selectedResponse = 'grouped';

  const years = { 1: 2021, 2: 2022, 3: 2022, 4: 2023, 5: 2024, 6: 2025, 7: 2026 };
  const settings = [
    { id: 'Urban', label: 'Urban environment', colour: '#016099' },
    { id: 'Rural', label: 'Rural environment', colour: '#0B5740' },
    { id: 'IDP Camp', label: 'IDP camp environment', colour: '#AC4399' }
  ];
  const plot = { left: 62, right: 690, top: 22, bottom: 235 };
  const x = (wave) => plot.left + ((wave - 1) / 6) * (plot.right - plot.left);
  const y = (value) => plot.bottom - (value / 100) * (plot.bottom - plot.top);
  const value = (row) => selectedResponse === 'grouped'
    ? row.percentage_valid
    : row.distribution.find((item) => item.category === selectedResponse)?.percentage_valid;
  $: series = settings.map((setting) => {
    const points = results
      .filter((row) => row.measure_id === measure.measure_id && row.wave !== 'all' && row.environment_type === setting.id)
      .sort((a, b) => a.wave - b.wave)
      .map((row) => ({ wave: row.wave, value: value(row), valid_n: row.valid_n }));
    return { ...setting, points, polyline: points.filter((point) => point.value !== null).map((point) => `${x(point.wave)},${y(point.value)}`).join(' ') };
  });
</script>

<figure class="setting-trend">
  <figcaption><strong>How responses differ over time</strong><span>{selectedResponse === 'grouped' ? measure.grouped_response : selectedResponse}</span></figcaption>
  <div class="setting-legend">{#each series as item}<span style={`--setting-colour:${item.colour}`}><i></i>{item.label}</span>{/each}</div>
  <svg viewBox="0 0 720 295" role="img" aria-label={`${selectedResponse === 'grouped' ? measure.grouped_response : selectedResponse} by survey environment and wave`}>
    {#each [0, 25, 50, 75, 100] as tick}
      <line class="gridline" x1={plot.left} y1={y(tick)} x2={plot.right} y2={y(tick)}></line>
      <text class="axis-label" x={plot.left - 12} y={y(tick) + 4} text-anchor="end">{tick}%</text>
    {/each}
    {#each [1, 2, 3, 4, 5, 6, 7] as wave}
      <text class="wave-label" x={x(wave)} y="261" text-anchor="middle"><tspan x={x(wave)}>W{wave}</tspan><tspan x={x(wave)} dy="15">({years[wave]})</tspan></text>
    {/each}
    {#each series as item}
      <polyline points={item.polyline} style={`--setting-colour:${item.colour}`}></polyline>
      {#each item.points as point}
        {#if point.value !== null}<circle cx={x(point.wave)} cy={y(point.value)} r="5" style={`--setting-colour:${item.colour}`}><title>{item.label}, Wave {point.wave} ({years[point.wave]}): {point.value.toFixed(1)}%, valid n={point.valid_n}</title></circle>{/if}
      {/each}
    {/each}
  </svg>
</figure>
