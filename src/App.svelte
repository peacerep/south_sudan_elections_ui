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
    <div class="footer-brand"><img class="footer-logo" src="/peacerep-logo.png" alt="PeaceRep" /><div><strong>PeaceRep</strong><span>South Sudan Perceptions of Peace Survey</span></div></div>
    <p>Seven waves of cross-sectional interviews, 2021–2026. Results are unweighted respondent distributions for surveyed locations, not national estimates. <a href="?view=about">About the survey →</a></p>
    <p class="footer-funders">Supported by UK International Development, USIP, the European Union and the Friedrich-Ebert-Stiftung South Sudan office.</p>
  </div>
</footer>
