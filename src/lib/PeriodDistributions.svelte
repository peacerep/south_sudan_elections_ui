<script>
  export let data;
  export let questionId;
  export let sortByResponse = false;
  const question = data.questions.find((item) => item.question_id === questionId);
  const periods = question.wave_summaries.map((summary) => {
    const rows = data.results.filter((row) => row.question_id === questionId && row.wave === summary.wave && !row.is_missing).sort((a, b) => sortByResponse ? b.percentage_valid - a.percentage_valid : a.category_order - b.category_order);
    const largest = Math.max(...rows.map((row) => row.percentage_valid));
    return { ...summary, rows: rows.map((row) => ({ ...row, leading: row.percentage_valid === largest })) };
  }).reverse();
</script>

<div class="period-distributions">
  {#each periods as period, index}
    <details open={index === 0}>
      <summary><span>{period.fieldwork_dates}</span><small>{period.valid_n.toLocaleString()} responses counted</small></summary>
      <div class="narrative-bars">
        {#each period.rows as row}<div class:highlighted={row.leading} class="narrative-bar-row"><span>{row.category}</span><div><i style={`width:${row.percentage_valid}%`}></i></div><strong>{row.percentage_valid.toFixed(1)}%</strong></div>{/each}
      </div>
      <p class="result-denominator">{period.missing_n.toLocaleString()} unanswered or blank</p>
    </details>
  {/each}
</div>
