<script>
  import data from '../lib/data/first-story-subgroups.json';
  import SettingTrend from '../lib/SettingTrend.svelte';

  const measureLabels = {
    elections_hopeful: 'Hopeful about elections',
    elections_afraid: 'Afraid about elections',
    election_violence_risk: 'Election-violence risk'
  };
  const measureColours = { elections_hopeful: '#0B5740', elections_afraid: '#AC4399', election_violence_risk: '#DF1F36' };
  let selectedMeasure = 'elections_hopeful';
  let selectedResponse = 'grouped';
  $: measure = data.measures.find((item) => item.measure_id === selectedMeasure);
  $: pooled = data.results.filter((row) => row.measure_id === selectedMeasure && row.wave === 'all');
  $: responseOptions = [{ value: 'grouped', label: measure.grouped_response }, ...measure.categories.map((category) => ({ value: category, label: category }))];
  $: metricLabel = responseOptions.find((item) => item.value === selectedResponse)?.label;
  $: seriesColour = measureColours[selectedMeasure];
  const metricValue = (row) => selectedResponse === 'grouped' ? row.percentage_valid : row.distribution.find((item) => item.category === selectedResponse)?.percentage_valid;
  const settingLabel = (value) => data.grouping.labels[value];
  const categoryColour = (category, measureId) => {
    if (measureId === 'election_violence_risk') return { 'Very low': '#32688A', 'Somehow low': '#80AEC4', 'Somehow high': '#F08A78', 'Very high': '#DF1F36' }[category];
    return { 'Strongly disagree': '#536D79', 'Disagree': '#A2B4BA', 'Neither agree nor disagree (nus-nus)': '#D7C875', 'Agree': measureId === 'elections_afraid' ? '#D288C4' : '#61C8B9', 'Strongly agree': measureColours[measureId] }[category];
  };
  function chooseMeasure(id) { selectedMeasure = id; selectedResponse = 'grouped'; }
</script>

<section class="respondent-hero">
  <p class="eyebrow"><a href="/">Election picture</a> · Survey environments</p>
  <h1>How responses differ across survey environments</h1>
  <p class="lede">Compare respondents interviewed in urban, rural and IDP camp environments. These differences describe the survey responses; they do not show that an environment caused a particular view.</p>
</section>

<section class="respondent-workspace" style={`--series-colour:${seriesColour};--map-colour:${seriesColour}`}>
  <div class="respondent-controls">
    <fieldset><legend>Question</legend><div class="measure-switcher">{#each data.measures as item}<button class:active={selectedMeasure === item.measure_id} on:click={() => chooseMeasure(item.measure_id)}>{measureLabels[item.measure_id]}</button>{/each}</div></fieldset>
    <label>Response compared
      <select bind:value={selectedResponse}>{#each responseOptions as option}<option value={option.value}>{option.label}</option>{/each}</select>
    </label>
  </div>

  <div class="respondent-heading"><p class="section-number">All available waves pooled</p><h2>{measureLabels[selectedMeasure]}</h2><p>{metricLabel}. Full distributions remain visible below.</p></div>
  <div class="setting-cards">
    {#each pooled as row}
      <article>
        <h3>{settingLabel(row.environment_type)}</h3>
        <p class="setting-value"><strong>{metricValue(row).toFixed(1)}%</strong><span>{metricLabel}</span></p>
        <div class="distribution-stack" aria-label={`Complete response distribution in ${settingLabel(row.environment_type)}`}>
          {#each row.distribution as item}<span class:highlighted={selectedResponse === item.category} style={`width:${item.percentage_valid}%;--category-colour:${categoryColour(item.category, measure.measure_id)}`} title={`${item.category}: ${item.percentage_valid.toFixed(1)}%`}></span>{/each}
        </div>
        <ul class="distribution-key">
          {#each row.distribution as item}<li class:highlighted={selectedResponse === item.category}><i style={`--category-colour:${categoryColour(item.category, measure.measure_id)}`}></i><span>{item.category}</span><strong>{item.percentage_valid.toFixed(1)}%</strong></li>{/each}
        </ul>
        <p class="setting-n">Valid responses: {row.valid_n.toLocaleString()} · Not answered: {row.missing_n.toLocaleString()}</p>
      </article>
    {/each}
  </div>

  <SettingTrend results={data.results} {measure} {selectedResponse} />

  <details class="setting-table"><summary>Accessible comparison table</summary><div class="table-scroll"><table><caption>{metricLabel} across all available waves</caption><thead><tr><th>Survey environment</th><th>Percentage</th><th>Valid responses</th><th>Not answered</th></tr></thead><tbody>{#each pooled as row}<tr><th>{settingLabel(row.environment_type)}</th><td>{metricValue(row).toFixed(1)}%</td><td>{row.valid_n.toLocaleString()}</td><td>{row.missing_n.toLocaleString()}</td></tr>{/each}</tbody></table></div></details>
</section>

<section class="respondent-evidence">
  <p class="section-number">How we know—and what we cannot conclude</p>
  <div class="respondent-evidence-grid">
    <article><h2>Calculation</h2><p>{data.method} All-waves figures pool respondents across the waves in which the question was asked.</p></article>
    <article><h2>Interpretation</h2><p>{data.grouping.note} The survey uses repeated cross-sections, so the people interviewed change between waves.</p></article>
    <article><h2>Limits</h2><p>Environment differences may reflect location coverage, fieldwork timing and respondent composition. They are not causal effects or national urban–rural–displacement estimates.</p></article>
  </div>
</section>
