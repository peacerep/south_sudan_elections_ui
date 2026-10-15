<script>
  import NarrativeQuestion from './NarrativeQuestion.svelte';
  export let data;
  let view = 'latest';
  const years = { 5: 2024, 6: 2025, 7: 2026 };
  const definitions = [
    { id: 'campaign_free', label: 'Parties can campaign freely', colour: '#0B5740' },
    { id: 'nec_credible', label: 'NEC can organise credible elections', colour: '#08778a' },
    { id: 'elections_fraud', label: 'Fraud is likely', colour: '#995326' },
    { id: 'elections_war', label: 'Elections could lead to full-scale war', colour: '#DF1F36' }
  ];
  const series = definitions.map((definition) => {
    const question = data.questions.find((item) => item.question_id === definition.id);
    return { ...definition, points: question.wave_summaries.map((period) => ({ wave: period.wave, year: years[period.wave], value: period.highlighted_percentage })) };
  });
  const plot = { left: 50, right: 700, top: 20, bottom: 170 };
  const x = (index, count) => count === 1 ? (plot.left + plot.right) / 2 : plot.left + index * (plot.right - plot.left) / (count - 1);
  const y = (value) => plot.bottom - value / 100 * (plot.bottom - plot.top);
  const points = (values) => values.map((point, index) => `${x(index, values.length)},${y(point.value)}`).join(' ');
</script>

<div class="conditions-panel">
  <div class="summary-tabs" role="tablist" aria-label="Choose election-conditions time view">
    <button role="tab" aria-selected={view === 'latest'} class:active={view === 'latest'} on:click={() => view = 'latest'}>Most recent survey</button>
    <button role="tab" aria-selected={view === 'trends'} class:active={view === 'trends'} on:click={() => view = 'trends'}>Change by survey wave</button>
  </div>
  {#if view === 'latest'}
    <div class="chapter-results two-results conditions-results">
      {#each definitions as definition}<NarrativeQuestion {data} questionId={definition.id} />{/each}
    </div>
  {:else}
    <div class="conditions-trends">
      {#each series as item}
        <section style={`--condition-colour:${item.colour}`}>
          <h3>{item.label}</h3>
          <svg viewBox="0 0 720 215" role="img" aria-label={`${item.label} across available survey waves`}>
            {#each [0,25,50,75,100] as tick}<line x1={plot.left} y1={y(tick)} x2={plot.right} y2={y(tick)}></line><text x={plot.left-9} y={y(tick)+4} text-anchor="end">{tick}%</text>{/each}
            <polyline points={points(item.points)}></polyline>
            {#each item.points as point,index}<circle cx={x(index,item.points.length)} cy={y(point.value)} r="5"></circle><text class="condition-point-value" x={x(index,item.points.length)} y={y(point.value)-11} text-anchor="middle">{point.value.toFixed(1)}%</text><text x={x(index,item.points.length)} y="198" text-anchor="middle">Wave {point.wave} · {point.year}</text>{/each}
          </svg>
        </section>
      {/each}
    </div>
  {/if}
</div>
