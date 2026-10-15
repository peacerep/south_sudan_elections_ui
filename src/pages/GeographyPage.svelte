<script>
  import geography from '../lib/data/first-story-geography.json';
  import backdrop from '../lib/data/map-backdrop.json';

  const years = { 1: 2021, 2: 2022, 3: 2022, 4: 2023, 5: 2024, 6: 2025, 7: 2026 };
  const measureLabels = {
    elections_hopeful: 'Hopeful about elections',
    elections_afraid: 'Afraid about elections',
    election_violence_risk: 'Election-violence risk',
    country_ready: 'South Sudan is ready for elections',
    election_timing: 'When elections should happen',
    nec_credible: 'Confidence in the Elections Commission',
    party_vision: 'Party with the best vision'
  };
  const measureColours = {
    elections_hopeful: '#0B5740',
    elections_afraid: '#AC4399',
    election_violence_risk: '#DF1F36',
    country_ready: '#08778a',
    election_timing: '#A46322',
    nec_credible: '#08778a',
    party_vision: '#634A8E'
  };
  const bounds = backdrop.bounds;
  let selectedMeasure = 'elections_hopeful';
  let selectedWave = 'all';
  let selectedLocation = null;
  let view = 'map';
  let selectedResponse = 'grouped';

  $: measure = geography.measures.find((item) => item.measure_id === selectedMeasure);
  $: waveOptions = measure.expected_waves;
  $: if (selectedWave !== 'all' && !waveOptions.includes(Number(selectedWave))) selectedWave = 'all';
  $: visibleRows = geography.results
    .filter((row) => row.measure_id === selectedMeasure && String(row.wave) === String(selectedWave))
    .sort((a, b) => a.display_name.localeCompare(b.display_name));
  $: if (!selectedLocation || !visibleRows.some((row) => row.location === selectedLocation)) {
    selectedLocation = visibleRows.find((row) => row.percentage_valid !== null)?.location ?? visibleRows[0]?.location;
  }
  $: responseOptions = [{ value: 'grouped', label: measure.grouped_response }, ...measure.categories.map((category) => ({ value: category, label: category }))];
  $: metricLabel = responseOptions.find((item) => item.value === selectedResponse)?.label ?? measure.grouped_response;

  function chooseMeasure(measureId) {
    selectedMeasure = measureId;
    selectedWave = measureId === 'party_vision' ? 7 : 'all';
    selectedLocation = null;
    selectedResponse = 'grouped';
  }
  const metricValue = (row) => selectedResponse === 'grouped'
    ? row.percentage_valid
    : row.distribution.find((item) => item.category === selectedResponse)?.percentage_valid ?? null;
  const categoryColour = (category, measureId) => {
    if (measureId === 'election_violence_risk') return {
      'Very low': '#32688A', 'Somehow low': '#80AEC4', 'Somehow high': '#F08A78', 'Very high': '#DF1F36'
    }[category];
    return {
      'Strongly disagree': '#536D79', 'Disagree': '#A2B4BA',
      'Neither agree nor disagree (nus-nus)': '#D7C875',
      'Agree': measureId === 'elections_afraid' ? '#D288C4' : '#61C8B9',
      'Strongly agree': measureColours[measureId]
    }[category] ?? measureColours[measureId];
  };
  $: mapRows = visibleRows.map((row) => ({
    ...row,
    metric_value: selectedResponse === 'grouped'
      ? row.percentage_valid
      : row.distribution.find((item) => item.category === selectedResponse)?.percentage_valid ?? null
  }));
  $: selected = mapRows.find((row) => row.location === selectedLocation);
  $: seriesColour = selectedResponse === 'grouped'
    ? measureColours[selectedMeasure]
    : categoryColour(selectedResponse, selectedMeasure) ?? measureColours[selectedMeasure];
  const left = (longitude) => `${100 * (longitude - bounds.west) / (bounds.east - bounds.west)}%`;
  const top = (latitude) => `${100 * (bounds.north - latitude) / (bounds.north - bounds.south)}%`;
  const dotSize = (value) => value === null ? 17 : 17 + (value / 100) * 18;
  const waveLabel = (wave) => wave === 'all' ? 'All available waves pooled' : `Wave ${wave} (${years[wave]})`;
</script>

<section class="geography-hero">
  <p class="eyebrow"><a href="/">Election picture</a> · Geography</p>
  <h1>How responses differ across surveyed locations</h1>
  <p class="lede">Explore the same hope, fear and expected-violence measures by named survey location. These are comparisons among respondents in surveyed places—not estimates for every person or every area of South Sudan.</p>
</section>

<section class="geography-workspace" style={`--map-colour: ${seriesColour}`}>
  <div class="geography-controls" aria-label="Geographic view controls">
    <fieldset>
      <legend>Question</legend>
      <div class="measure-switcher">
        {#each geography.measures as item}
          <button class:active={selectedMeasure === item.measure_id} on:click={() => chooseMeasure(item.measure_id)}>{measureLabels[item.measure_id]}</button>
        {/each}
      </div>
    </fieldset>
    <label>Survey period
      <select bind:value={selectedWave} on:change={() => selectedLocation = null}>
        <option value="all">All available waves pooled</option>
        {#each waveOptions as wave}<option value={wave}>Wave {wave} ({years[wave]})</option>{/each}
      </select>
    </label>
    <label>Response shown on map
      <select bind:value={selectedResponse}>
        {#each responseOptions as option}<option value={option.value}>{option.label}</option>{/each}
      </select>
    </label>
  </div>

  <div class="geography-heading">
    <div>
      <p class="section-number">What people are saying</p>
      <h2>{measureLabels[selectedMeasure]}</h2>
      <p>{metricLabel} · {waveLabel(selectedWave)}</p>
    </div>
    <div class="view-switcher" aria-label="View as">
      <button class:active={view === 'map'} on:click={() => view = 'map'}>Map</button>
      <button class:active={view === 'list'} on:click={() => view = 'list'}>List</button>
    </div>
  </div>

  {#if view === 'map'}
    <div class="map-layout">
      <div>
        <div class="location-map" role="img" aria-label={`${measureLabels[selectedMeasure]} across ${visibleRows.length} surveyed location labels`}>
          <svg class="map-backdrop" viewBox={backdrop.viewBox.join(' ')} aria-hidden="true">
            <defs>
              <filter id="map-shadow" x="-20%" y="-20%" width="140%" height="140%"><feDropShadow dx="2" dy="3" stdDeviation="7" flood-color="#091f40" flood-opacity=".13" /></filter>
            </defs>
            <path class="country-shape" d={backdrop.country}></path>
            {#each backdrop.regions as region}<path class:special-region={region.special} class="region-shape" d={region.path}></path>{/each}
            {#each backdrop.disputed as path}<path class="disputed-shape" d={path}></path>{/each}
            {#each backdrop.nile as path}<path class="nile-shape" d={path}></path>{/each}
          </svg>
          <span class="north-label" aria-hidden="true">N ↑</span>
          {#each geography.coverage as place}
            <span class="coverage-point" style={`left:${left(place.longitude)};top:${top(place.latitude)}`} aria-hidden="true"></span>
          {/each}
          {#each mapRows as row}
            {@const value = row.metric_value}
            <button
              class="map-point"
              class:selected={selectedLocation === row.location}
              class:suppressed={value === null}
              style={`left:${left(row.longitude)};top:${top(row.latitude)};width:${dotSize(value)}px;height:${dotSize(value)}px;opacity:${value === null ? .7 : .48 + value / 200}`}
              aria-label={`${row.display_name}, ${row.adm1}: ${value === null ? 'result suppressed' : `${value.toFixed(1)} percent selecting ${metricLabel}`}`}
              title={`${row.display_name}: ${value === null ? 'Suppressed' : `${value.toFixed(1)}% ${metricLabel}`}`}
              on:click={() => selectedLocation = row.location}
            ><span class="sr-only">{row.display_name}</span></button>
          {/each}
        </div>
        <div class="map-key"><span><i class="sample-key"></i>{metricLabel}</span><span><i class="coverage-key"></i>Location surveyed in another period</span></div>
        <p class="map-note">Larger, darker markers indicate a higher percentage selecting <strong>{metricLabel}</strong>. Only marked locations were surveyed; blank areas do not represent zero responses. Co-located survey environments may overlap—use the list for the complete comparison.</p>
      </div>
      {#if selected}{@render LocationDetail(selected, measure, waveLabel(selectedWave), selectedResponse, metricLabel)}{/if}
    </div>
  {:else}
    <div class="location-list table-scroll">
      <table>
        <caption>{measureLabels[selectedMeasure]} · {waveLabel(selectedWave)}</caption>
        <thead><tr><th>Survey location</th><th>State</th><th>{metricLabel}</th><th>Valid responses</th><th>Not answered</th></tr></thead>
        <tbody>
          {#each visibleRows as row}
            {@const value = metricValue(row)}
            <tr>
              <th><button on:click={() => { selectedLocation = row.location; view = 'map'; }}>{row.display_name}</button></th>
              <td>{row.adm1}</td>
              <td>{value === null ? 'Suppressed' : `${value.toFixed(1)}%`}</td>
              <td>{row.valid_n.toLocaleString()}</td>
              <td>{row.missing_n.toLocaleString()}</td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  {/if}
</section>

<section class="geography-evidence" aria-labelledby="geography-evidence-title">
  <p class="section-number">How we know</p>
  <h2 id="geography-evidence-title">What this view represents</h2>
  <div class="evidence-grid geography-evidence-grid">
    <article><h3>Calculation</h3><p>{geography.method}</p></article>
    <article><h3>Locations</h3><p>{geography.coordinate_method}</p></article>
    <article><h3>Disclosure</h3><p>{geography.suppression.rule} This threshold is provisional pending disclosure review.</p></article>
  </div>
  <div class="geography-limit"><strong>What we cannot conclude:</strong> differences between locations may reflect who was interviewed, when fieldwork occurred and the settings covered. They are not community rankings, national estimates or evidence that location caused an opinion.</div>
</section>

{#snippet LocationDetail(row, measure, period, selectedCategory, selectedMetricLabel)}
  <aside class="location-detail" aria-live="polite">
    <p class="eyebrow">Selected survey location</p>
    <h3>{row.display_name}</h3>
    <p class="place-meta">{row.adm2}, {row.adm1}</p>
    {#if row.percentage_valid === null}
      <p class="suppressed-value">Result suppressed</p>
      <p>There were {row.valid_n.toLocaleString()} valid responses—below the provisional publication threshold of {geography.suppression.threshold}.</p>
    {:else}
      <p class="location-value"><strong>{row.metric_value.toFixed(1)}%</strong><span>{selectedMetricLabel}</span></p>
      <div class="response-distribution">
        <h4>Complete response distribution</h4>
        <div class="distribution-stack" aria-label={`Complete valid-response distribution for ${row.display_name}`}>
          {#each row.distribution as item}
            <span class:highlighted={selectedCategory === item.category} style={`width:${item.percentage_valid}%;--category-colour:${categoryColour(item.category, measure.measure_id)}`} title={`${item.category}: ${item.percentage_valid.toFixed(1)}%`}></span>
          {/each}
        </div>
        <ul class="distribution-key">
          {#each row.distribution as item}
            <li class:highlighted={selectedCategory === item.category}><i style={`--category-colour:${categoryColour(item.category, measure.measure_id)}`}></i><span>{item.category}</span><strong>{item.percentage_valid.toFixed(1)}%</strong></li>
          {/each}
        </ul>
      </div>
      <dl>
        <div><dt>Period</dt><dd>{period}</dd></div>
        <div><dt>Valid responses</dt><dd>{row.valid_n.toLocaleString()}</dd></div>
        <div><dt>Selected responses</dt><dd>{selectedCategory === 'grouped' ? row.numerator.toLocaleString() : row.distribution.find((item) => item.category === selectedCategory)?.numerator.toLocaleString()}</dd></div>
        <div><dt>Not answered</dt><dd>{row.missing_n.toLocaleString()}</dd></div>
      </dl>
    {/if}
    <details><summary>Exact question</summary><p>“{measure.question}”</p></details>
  </aside>
{/snippet}
