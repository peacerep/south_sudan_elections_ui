<script>
  import MeasurePanel from '../lib/MeasurePanel.svelte';
  import data from '../lib/data/first-story.json';
</script>

<section class="hero finding-hero">
  <p class="eyebrow"><a href="/">Overview</a> · Trends</p>
  <h1>How views on elections have changed over time</h1>
  <p class="lede">Compare the percentage giving the highlighted response in each survey year, and inspect the complete response distribution for the latest wave.</p>
</section>

<section id="saying" class="content-section trends-section">
  <div class="section-intro"><h2>Annual trends and response distributions</h2><p>These charts separate the seven survey waves rather than combining them, making change and stability visible.</p></div>
  <div class="measure-list">{#each data.measures as measure}<MeasurePanel {measure} results={data.results} />{/each}</div>
  <div class="detail-actions"><a class="primary-link" href="/geography/">Explore surveyed locations <span aria-hidden="true">→</span></a><a class="primary-link" href="/environments/">Compare survey environments <span aria-hidden="true">→</span></a></div>
</section>
