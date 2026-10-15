<script>
  export let measure;
  export let results = [];

  const positive = {
    elections_hopeful: new Set(['Agree', 'Strongly agree']),
    elections_afraid: new Set(['Agree', 'Strongly agree']),
    election_violence_risk: new Set(['Somehow high', 'Very high'])
  };
  const leadLabel = {
    elections_hopeful: 'Agree or strongly agree',
    elections_afraid: 'Agree or strongly agree',
    election_violence_risk: 'Somehow high or very high'
  };
  const seriesColor = {
    elections_hopeful: '#0B5740',
    elections_afraid: '#AC4399',
    election_violence_risk: '#DF1F36'
  };
  const measureRows = results.filter((row) => row.measure_id === measure.measure_id);
  const waves = [...new Set(measureRows.map((row) => row.wave))].sort((a, b) => a - b);
  const latestWave = Math.max(...waves);
  const latest = measureRows.filter((row) => row.wave === latestWave);
  const displayRows = latest.filter((row) => row.percentage_valid !== null);
  const trend = waves.map((wave) => {
    const rows = measureRows.filter((row) => row.wave === wave && row.percentage_valid !== null);
    return {
      wave,
      value: rows
        .filter((row) => positive[measure.measure_id].has(row.category))
        .reduce((sum, row) => sum + row.percentage_valid, 0)
    };
  });
  const plot = { left: 66, right: 704, top: 20, bottom: 240 };
  const years = { 1: 2021, 2: 2022, 3: 2022, 4: 2023, 5: 2024, 6: 2025, 7: 2026 };
  const xPosition = (index) => trend.length === 1
    ? (plot.left + plot.right) / 2
    : plot.left + (index * (plot.right - plot.left)) / (trend.length - 1);
  const yPosition = (value) => plot.bottom - (value / 100) * (plot.bottom - plot.top);
  const trendPoints = trend
    .map((point, index) => `${xPosition(index)},${yPosition(point.value)}`)
    .join(' ');
  const validN = latest[0]?.valid_n;
  const missingN = latest[0]?.missing_n;
</script>

<article class="measure" aria-labelledby={`${measure.measure_id}-title`} style={`--series-color: ${seriesColor[measure.measure_id]}`}>
  <div class="measure-heading">
    <div>
      <p class="eyebrow">Latest response distribution</p>
      <h3 id={`${measure.measure_id}-title`}>{measure.question}</h3>
    </div>
    <p class="measure-definition">{leadLabel[measure.measure_id]}</p>
  </div>

  <div class="distribution" aria-label={`Response distribution for ${measure.question}`}>
    {#each displayRows as row}
      <div class="bar-row">
        <span>{row.category}</span>
        <div class="bar-track"><span style={`width: ${row.percentage_valid}%`}></span></div>
        <strong>{row.percentage_valid.toFixed(1)}%</strong>
      </div>
    {/each}
  </div>

  <div class="trend-block">
    <p><strong>Across available waves</strong></p>
    <svg class="trend" viewBox="0 0 720 300" role="img" aria-label={`${leadLabel[measure.measure_id]}: ${trend[0].value.toFixed(1)} percent in Wave ${trend[0].wave}, ${years[trend[0].wave]}, and ${trend.at(-1).value.toFixed(1)} percent in Wave ${trend.at(-1).wave}, ${years[trend.at(-1).wave]}`}>
      {#each [0, 25, 50, 75, 100] as tick}
        <line class="gridline" x1={plot.left} y1={yPosition(tick)} x2={plot.right} y2={yPosition(tick)}></line>
        <text class="axis-label" x={plot.left - 12} y={yPosition(tick) + 4} text-anchor="end">{tick}%</text>
      {/each}
      <polyline points={trendPoints}></polyline>
      {#each trend as point, index}
        <circle cx={xPosition(index)} cy={yPosition(point.value)} r="6"></circle>
        <text class="point-label" x={xPosition(index)} y={yPosition(point.value) - 13} text-anchor="middle">{point.value.toFixed(0)}%</text>
        <text class="wave-label" x={xPosition(index)} y="268" text-anchor="middle"><tspan x={xPosition(index)}>Wave {point.wave}</tspan><tspan x={xPosition(index)} dy="15">({years[point.wave]})</tspan></text>
      {/each}
    </svg>
  </div>

  <details>
    <summary>Exact question and denominator</summary>
    <p class="question">“{measure.question}”</p>
    <dl>
      <div><dt>Latest source</dt><dd>Wave {latestWave}, {latest[0]?.fieldwork_dates}</dd></div>
      <div><dt>Valid responses</dt><dd>{validN?.toLocaleString()}</dd></div>
      <div><dt>Not answered</dt><dd>{missingN?.toLocaleString()}</dd></div>
      <div><dt>Calculation</dt><dd>Unweighted percentage of valid responses</dd></div>
    </dl>
  </details>

  <details>
    <summary>Accessible data table</summary>
    <div class="table-scroll">
      <table>
        <caption>Wave {latestWave} response distribution</caption>
        <thead><tr><th>Response</th><th>Count</th><th>Valid %</th><th>All respondents %</th></tr></thead>
        <tbody>
          {#each latest as row}
            <tr><th>{row.category}</th><td>{row.numerator.toLocaleString()}</td><td>{row.percentage_valid === null ? '—' : `${row.percentage_valid.toFixed(1)}%`}</td><td>{row.percentage_all.toFixed(1)}%</td></tr>
          {/each}
        </tbody>
      </table>
    </div>
  </details>
</article>
