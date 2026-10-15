<script>
  import geography from './data/first-story-geography.json';
  import backdrop from './data/map-backdrop.json';

  const labels = { elections_hopeful: 'Hope about elections', elections_afraid: 'Fear about elections', election_violence_risk: 'Perceived election-violence risk', country_ready: 'South Sudan is ready for elections', election_timing: 'When elections should happen', nec_credible: 'Confidence in the Elections Commission', party_vision: 'Party with the best vision' };
  const groups = [
    { label: 'Feelings', ids: ['elections_hopeful', 'elections_afraid', 'election_violence_risk'] },
    { label: 'Readiness and timing', ids: ['country_ready', 'election_timing', 'nec_credible'] },
    { label: 'Party vision', ids: ['party_vision'] }
  ];
  const colours = { elections_hopeful: '#0B5740', elections_afraid: '#AC4399', election_violence_risk: '#DF1F36', country_ready: '#08778a', election_timing: '#A46322', nec_credible: '#08778a', party_vision: '#634A8E' };
  const years = { 1: 2021, 2: 2022, 3: 2022, 4: 2023, 5: 2024, 6: 2025, 7: 2026 };
  const bounds = backdrop.bounds;
  let selectedMeasure = 'elections_hopeful';
  let selectedWave = 7;
  let selectedResponse = 'grouped';
  let selectedLocation = null;
  let view = 'map';

  $: measure = geography.measures.find((item) => item.measure_id === selectedMeasure);
  $: waveOptions = measure.expected_waves;
  $: if (!waveOptions.includes(Number(selectedWave))) selectedWave = Math.max(...waveOptions);
  $: responseOptions = [{ value: 'grouped', label: measure.grouped_response }, ...measure.categories.map((category) => ({ value: category, label: category }))];
  $: metricLabel = responseOptions.find((item) => item.value === selectedResponse)?.label ?? measure.grouped_response;
  $: baseRows = geography.results.filter((row) => row.measure_id === selectedMeasure && row.wave === Number(selectedWave)).sort((a,b) => a.display_name.localeCompare(b.display_name));
  $: rows = baseRows.map((row) => ({ ...row, metric_value: selectedResponse === 'grouped' ? row.percentage_valid : row.distribution.find((item) => item.category === selectedResponse)?.percentage_valid ?? 0 }));
  $: if (!selectedLocation || !rows.some((row) => row.location === selectedLocation)) selectedLocation = rows.find((row) => row.metric_value !== null)?.location;
  $: selected = rows.find((row) => row.location === selectedLocation);
  $: overallNumerator = rows.reduce((sum, row) => sum + (selectedResponse === 'grouped' ? row.numerator : row.distribution.find((item) => item.category === selectedResponse)?.numerator ?? 0), 0);
  $: overallDenominator = rows.reduce((sum, row) => sum + row.valid_n, 0);
  $: overall = overallDenominator ? 100 * overallNumerator / overallDenominator : 0;
  const left = (longitude) => `${100 * (longitude - bounds.west) / (bounds.east - bounds.west)}%`;
  const top = (latitude) => `${100 * (bounds.north - latitude) / (bounds.north - bounds.south)}%`;
  const dotSize = (value) => value === null ? 17 : 17 + value / 100 * 18;
  const categoryColour = (category) => selectedMeasure === 'election_violence_risk'
    ? ({ 'Very low':'#32688A','Somehow low':'#80AEC4','Somehow high':'#F08A78','Very high':'#DF1F36' }[category] ?? colours[selectedMeasure])
    : ({ 'Strongly disagree':'#536D79','Disagree':'#A2B4BA','Neither agree nor disagree (nus-nus)':'#D7C875','Agree':'#61C8B9','Strongly agree':colours[selectedMeasure] }[category] ?? colours[selectedMeasure]);
  function chooseMeasure(id) { selectedMeasure=id; selectedResponse='grouped'; selectedLocation=null; selectedWave=7; }
</script>

<div class="story-map" style={`--map-colour:${colours[selectedMeasure]}`}>
  <div class="story-map-controls">
    <fieldset><legend>Question shown</legend><div class="map-question-groups">{#each groups as group}<div><span>{group.label}</span><div class="measure-switcher">{#each group.ids as id}<button class:active={selectedMeasure===id} on:click={() => chooseMeasure(id)}>{labels[id]}</button>{/each}</div></div>{/each}</div></fieldset>
    <div class="view-switcher" aria-label="View as"><button class:active={view==='map'} on:click={() => view='map'}>Map</button><button class:active={view==='list'} on:click={() => view='list'}>List</button></div>
  </div>
  <div class="map-filter-row"><label>Survey wave<select bind:value={selectedWave} on:change={() => selectedLocation=null}>{#each waveOptions.slice().reverse() as wave}<option value={wave}>Wave {wave} ({years[wave]})</option>{/each}</select></label><label>Response shown<select bind:value={selectedResponse}>{#each responseOptions as option}<option value={option.value}>{option.label}</option>{/each}</select></label></div>
  <div class="map-period"><strong>{Number(selectedWave) === 7 ? 'Most recent survey' : `Survey Wave ${selectedWave}`}</strong><span>Wave {selectedWave} · {years[selectedWave]}</span><span>Overall: {overall.toFixed(1)}% {metricLabel.toLowerCase()}</span></div>
  {#if view === 'map'}
    <div class="map-layout">
      <div>
        <div class="location-map" role="img" aria-label={`${labels[selectedMeasure]} across surveyed locations in Wave ${selectedWave}`}>
          <svg class="map-backdrop" viewBox={backdrop.viewBox.join(' ')} aria-hidden="true"><path class="country-shape" d={backdrop.country}></path>{#each backdrop.regions as region}<path class:special-region={region.special} class="region-shape" d={region.path}></path>{/each}{#each backdrop.disputed as path}<path class="disputed-shape" d={path}></path>{/each}{#each backdrop.nile as path}<path class="nile-shape" d={path}></path>{/each}</svg>
          <span class="north-label" aria-hidden="true">N ↑</span>
          {#each rows as row}<button class="map-point" class:selected={selectedLocation===row.location} class:suppressed={row.metric_value===null} style={`left:${left(row.longitude)};top:${top(row.latitude)};width:${dotSize(row.metric_value)}px;height:${dotSize(row.metric_value)}px;opacity:${row.metric_value === null ? .7 : .48 + row.metric_value / 200}`} aria-label={`${row.display_name}: ${row.metric_value===null?'result unavailable':`${row.metric_value.toFixed(1)} percent`}`} on:click={() => selectedLocation=row.location}><span class="sr-only">{row.display_name}</span></button>{/each}
        </div>
        <p class="map-note">Larger, darker markers indicate a higher percentage selecting <strong>{metricLabel}</strong>. Only locations surveyed in this wave appear. Blank areas do not represent zero responses.</p>
      </div>
      {#if selected}<aside class="location-detail">
        <p class="eyebrow">Selected survey location</p><h3>{selected.display_name}</h3><p class="place-meta">{selected.adm2}, {selected.adm1}</p>
        {#if selected.metric_value===null}<p class="suppressed-value">No valid result available</p>
        {:else}<p class="location-value"><strong>{selected.metric_value.toFixed(1)}%</strong><span>{metricLabel}</span></p><p class="overall-comparison">Overall Wave {selectedWave} result: <strong>{overall.toFixed(1)}%</strong> · {(selected.metric_value-overall)>=0?'↑':'↓'} {Math.abs(selected.metric_value-overall).toFixed(1)} percentage points</p>
          <div class="response-distribution"><h4>Complete response distribution</h4><ul class="distribution-key">{#each selected.distribution as item}<li class:highlighted={selectedResponse===item.category}><i style={`--category-colour:${categoryColour(item.category)}`}></i><span>{item.category}</span><strong>{item.percentage_valid.toFixed(1)}%</strong></li>{/each}</ul></div>
          <dl><div><dt>Responses counted</dt><dd>{selected.valid_n.toLocaleString()}</dd></div><div><dt>Unanswered</dt><dd>{selected.missing_n.toLocaleString()}</dd></div></dl>{/if}
        <details><summary>Exact question</summary><p>“{measure.question}”</p></details>
      </aside>{/if}
    </div>
  {:else}
    <div class="location-list table-scroll"><table><caption>{labels[selectedMeasure]} by surveyed location · Wave {selectedWave}</caption><thead><tr><th>Survey location</th><th>State</th><th>{metricLabel}</th><th>Responses counted</th><th>Unanswered</th></tr></thead><tbody>{#each rows as row}<tr><th><button on:click={() => {selectedLocation=row.location;view='map';}}>{row.display_name}</button></th><td>{row.adm1}</td><td>{row.metric_value===null?'Unavailable':`${row.metric_value.toFixed(1)}%`}</td><td>{row.valid_n}</td><td>{row.missing_n}</td></tr>{/each}</tbody></table></div>
  {/if}
</div>
