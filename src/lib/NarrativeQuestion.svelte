<script>
  export let data;
  export let questionId;
  export let compact = false;
  export let showTrend = true;
  export let sortByResponse = false;
  export let boldTop = 0;

  const years = { 1: 2021, 2: 2022, 3: 2022, 4: 2023, 5: 2024, 6: 2025, 7: 2026 };
  const colours = { elections_hopeful: '#0B5740', elections_afraid: '#AC4399', election_violence_risk: '#DF1F36', campaign_free: '#0B5740', nec_credible: '#08778a', elections_fraud: '#995326', elections_war: '#DF1F36' };
  $: question = data.questions.find((item) => item.question_id === questionId);
  $: latestWave = Math.max(...question.expected_waves);
  $: rows = data.results
    .filter((row) => row.question_id === questionId && row.wave === latestWave)
    .sort((a, b) => a.category_order - b.category_order);
  $: validRows = rows.filter((row) => !row.is_missing).sort((a, b) => sortByResponse ? b.percentage_valid - a.percentage_valid : a.category_order - b.category_order);
  $: missingRows = rows.filter((row) => row.is_missing);
  $: summary = question.wave_summaries.find((item) => item.wave === latestWave);
  $: highlighted = summary.highlighted_percentage;
  $: previous = question.wave_summaries.at(-2);
  $: change = highlighted !== null && previous?.highlighted_percentage !== null ? highlighted - previous.highlighted_percentage : null;
</script>

<article class:compact class="narrative-question" style={`--question-colour:${colours[questionId] ?? '#016099'}`} aria-labelledby={`${questionId}-title`}>
  <header>
    <div>
      <p class="result-period">{summary.fieldwork_dates}</p>
      <h3 id={`${questionId}-title`}>{question.public_label}</h3>
    </div>
    {#if highlighted !== null}
      <p class="result-value"><strong>{highlighted.toFixed(1)}%</strong><span>{question.response_type === 'risk' ? 'said somehow high or very high' : 'agreed or strongly agreed'}</span>{#if change !== null}<em><b>{change >= 0 ? '↑' : '↓'} {Math.abs(change).toFixed(1)} pp</b> from {years[previous.wave]}</em>{/if}</p>
    {/if}
  </header>

  <div class="narrative-bars" aria-label={`Complete responses to ${question.public_label}`}>
    {#each validRows as row, index}
      <div class:highlighted={row.is_highlighted || index < boldTop} class="narrative-bar-row">
        <span>{row.category}</span>
        <div><i style={`width:${row.percentage_valid}%`}></i></div>
        <strong>{row.percentage_valid.toFixed(1)}%</strong>
      </div>
    {/each}
  </div>

  <p class="result-denominator">{summary.valid_n.toLocaleString()} responses counted · {summary.missing_n.toLocaleString()} unanswered or blank</p>

  <details class="result-evidence">
    <summary>Question, periods and counts</summary>
    <p class="exact-question">“{question.question}”</p>
    {#if showTrend && question.highlight_categories.length}
      <div class="table-scroll">
        <table>
          <caption>{question.public_label} across available survey periods</caption>
          <thead><tr><th>Period</th><th>Highlighted answers</th><th>Responses counted</th><th>Unanswered</th></tr></thead>
          <tbody>{#each question.wave_summaries as period}<tr><th>{years[period.wave]}</th><td>{period.highlighted_percentage.toFixed(1)}%</td><td>{period.valid_n.toLocaleString()}</td><td>{period.missing_n.toLocaleString()}</td></tr>{/each}</tbody>
        </table>
      </div>
    {:else}
      <p>Available survey periods: {question.wave_summaries.map((period) => years[period.wave]).join(', ')}.</p>
    {/if}
    {#if missingRows.length}
      <p>Unanswered or blank cases are excluded from the percentages and reported separately above.</p>
    {/if}
  </details>
</article>
