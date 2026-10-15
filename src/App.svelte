<script>
  import HomePage from './pages/HomePage.svelte';
  import FindingPage from './pages/FindingPage.svelte';
  import GeographyPage from './pages/GeographyPage.svelte';
  import RespondentsPage from './pages/RespondentsPage.svelte';
  import SurveyInfoPage from './pages/SurveyInfoPage.svelte';

  const path = window.location.pathname.replace(/\/+$/, '') || '/';
  const requestedView = new URLSearchParams(window.location.search).get('view');
  const page = requestedView === 'about' || path === '/about' || path === '/survey-info'
    ? 'about'
    : path === '/environments' || path === '/respondents'
    ? 'respondents'
    : path === '/geography'
    ? 'geography'
    : path === '/trends' || path === '/findings/hope-fear-violence'
      ? 'trends'
      : 'home';
</script>

<svelte:head>
  <meta name="robots" content="noindex,nofollow" />
  <title>{page === 'home' ? 'South Sudan Elections: What People Think' : page === 'about' ? 'About the Perceptions of Peace Survey' : page === 'geography' ? 'Election opinions by surveyed location' : page === 'respondents' ? 'Election opinions by survey environment' : 'Election opinion trends'}</title>
</svelte:head>

<header class="site-header">
  <a class="brand" href="./" aria-label="PeaceRep — South Sudan Elections"><img class="brand-mark" src="https://peacerep.github.io/logos/img/PeaceRep_Icon_white.png" alt="PeaceRep" /><span>South Sudan Elections</span></a>
  <nav class="site-nav" aria-label="Primary navigation">
    <a href="./" aria-current={page === 'home' ? 'page' : undefined}>Public views on elections</a>
    <a href="?view=about" aria-current={page === 'about' ? 'page' : undefined}>About the survey</a>
  </nav>
</header>

<main id="top">
  {#if page === 'about'}
    <SurveyInfoPage />
  {:else if page === 'respondents'}
    <RespondentsPage />
  {:else if page === 'geography'}
    <GeographyPage />
  {:else if page === 'trends'}
    <FindingPage />
  {:else}
    <HomePage />
  {/if}
</main>

<footer class="site-footer">
  <div class="footer-inner">
    <div><strong>PeaceRep</strong><span>South Sudan Perceptions of Peace Survey</span></div>
    <p><strong>Status:</strong> Not for public release yet.</p>
    <p><strong>About the survey:</strong> Waves 1–7 contain 27,203 substantive adult interviews conducted from 2021 to 2026 across 29 recorded survey locations in 16 counties. Each wave interviewed a new cross-section; the survey does not follow the same people over time.</p>
    <p><strong>Interpreting the results:</strong> Results are unweighted respondent distributions for surveyed locations, not national population estimates or forecasts. Percentages use valid responses; unanswered cases are reported separately in the detailed charts.</p>
    <p><strong>Research team:</strong> Jan Pospisil, David Deng, Christopher Oringa and Sophia Dawkins. Public data collated and cleaned by Niamh Henry.</p>
    <p>Supported by UK International Development, USIP and the Friedrich-Ebert-Stiftung South Sudan office. The views expressed do not necessarily reflect the UK Government’s official policies.</p>
  </div>
</footer>
