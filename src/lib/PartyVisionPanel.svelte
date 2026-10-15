<script>
  import NarrativeQuestion from './NarrativeQuestion.svelte';
  import PeriodDistributions from './PeriodDistributions.svelte';
  export let data;
  let view = 'latest';
  const years = { 3: 2022, 4: 2023, 5: 2024, 6: 2025, 7: 2026 };
  const waves = [3, 4, 5, 6, 7];
  const series = [
    { id: 'splm', label: 'SPLM / SPLM-IG', colour: '#08778a', matches: (category) => category === 'Sudan People’s Liberation Movement (SPLM)' || category.includes('In Government (SPLM-IG)') },
    { id: 'splm_io', label: 'SPLM-IO', colour: '#995326', matches: (category) => category.includes('In Opposition (SPLM-IO)') },
    { id: 'none', label: 'None of the parties', colour: '#6f5a9c', matches: (category) => category === 'None of the parties', available: (wave) => wave >= 6 }
  ].map((item) => ({
    ...item,
    points: waves.map((wave) => {
      const rows = data.results.filter((row) => row.question_id === 'party_vision' && row.wave === wave);
      const numerator = rows.filter((row) => !row.is_missing && item.matches(row.category)).reduce((sum, row) => sum + row.numerator, 0);
      return { wave, year: years[wave], value: item.available && !item.available(wave) ? null : 100 * numerator / rows[0].valid_n };
    })
  }));
  const plot = { left: 54, right: 704, top: 20, bottom: 180 };
  const x = (index) => plot.left + index * (plot.right - plot.left) / (waves.length - 1);
  const y = (value) => plot.bottom - value / 70 * (plot.bottom - plot.top);
  const points = (values) => values.map((point, index) => point.value === null ? null : `${x(index)},${y(point.value)}`).filter(Boolean).join(' ');
</script>

<div class="party-vision-panel">
  <div class="summary-tabs party-tabs" role="tablist" aria-label="Choose party-vision time view">
    <button role="tab" aria-selected={view === 'latest'} class:active={view === 'latest'} on:click={() => view = 'latest'}>Most recent survey</button>
    <button role="tab" aria-selected={view === 'trend'} class:active={view === 'trend'} on:click={() => view = 'trend'}>Selected responses over time</button>
    <button role="tab" aria-selected={view === 'waves'} class:active={view === 'waves'} on:click={() => view = 'waves'}>Full results by wave</button>
  </div>
  {#if view === 'latest'}
    <NarrativeQuestion {data} questionId="party_vision" showTrend={false} sortByResponse boldTop={2} />
  {:else if view === 'trend'}
    <div class="party-trend">
      <div class="party-trend-legend">{#each series as item}<span style={`--party-colour:${item.colour}`}><i></i>{item.label}</span>{/each}</div>
      <svg viewBox="0 0 720 230" role="img" aria-label="Share selecting SPLM or SPLM-IG, SPLM-IO and none of the parties as having the best vision across available waves">
        {#each [0,20,40,60] as tick}<line x1={plot.left} y1={y(tick)} x2={plot.right} y2={y(tick)}></line><text x={plot.left - 10} y={y(tick)+4} text-anchor="end">{tick}%</text>{/each}
        {#each series as item}
          <polyline style={`--party-colour:${item.colour}`} points={points(item.points)}></polyline>
          {#each item.points as point, index}{#if point.value !== null}<circle style={`--party-colour:${item.colour}`} cx={x(index)} cy={y(point.value)} r="5"></circle><text class="party-point-value" style={`--party-colour:${item.colour}`} x={x(index)} y={y(point.value)-11} text-anchor="middle">{point.value.toFixed(1)}%</text>{/if}{/each}
        {/each}
        {#each waves as wave,index}<text x={x(index)} y="208" text-anchor="middle"><tspan x={x(index)}>Wave {wave}</tspan><tspan x={x(index)} dy="13">{years[wave]}</tspan></text>{/each}
      </svg>
      <p class="party-period-note">The early “SPLM” response is shown with the later “SPLM-IG” label. “None of the parties” was introduced as an explicit answer in Wave 6, so it is shown only for 2025 and 2026. Percentages use valid responses within each wave. This is not a measure of voting intention.</p>
    </div>
  {:else}
    <p class="party-period-note">Each wave is shown separately and ranked by response share. Blank responses in earlier waves are reported outside the valid percentages; they cannot yet be assumed to mean “None of the parties”.</p>
    <PeriodDistributions {data} questionId="party_vision" sortByResponse />
  {/if}
</div>
