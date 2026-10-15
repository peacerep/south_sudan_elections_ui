<script>
  import SummaryLollipop from '../lib/SummaryLollipop.svelte';
  import StoryNav from '../lib/StoryNav.svelte';
  import NarrativeQuestion from '../lib/NarrativeQuestion.svelte';
  import PeriodDistributions from '../lib/PeriodDistributions.svelte';
  import ReadinessComparison from '../lib/ReadinessComparison.svelte';
  import PartyVisionPanel from '../lib/PartyVisionPanel.svelte';
  import ConditionsPanel from '../lib/ConditionsPanel.svelte';
  import StoryMap from '../lib/StoryMap.svelte';
  import data from '../lib/data/first-story.json';
  import narrative from '../lib/data/narrative-story.json';

  const sections = [
    { id: 'feelings', shortLabel: 'How do elections make people feel?' },
    { id: 'readiness', shortLabel: 'Do people feel ready?' },
    { id: 'choices', shortLabel: 'What shapes voting choices?' },
    { id: 'party-vision', shortLabel: 'Which parties offer a vision?' },
    { id: 'conditions', shortLabel: 'What could make elections credible—or unsafe?' },
    { id: 'places', shortLabel: 'Where do views differ?' }
  ];
</script>

<section class="home-hero">
  <p class="eyebrow">South Sudan Perceptions of Peace Survey · 2021–2026</p>
  <h1>What people are saying about elections in South Sudan</h1>
  <div class="hero-copy">
    <div class="election-context">
      <p>National elections are the planned endpoint of South Sudan’s post-civil-war transition. Repeatedly delayed, they are currently scheduled for 22 December 2026 and would be the country’s first national elections since independence in 2011.</p>
    </div>
    <p class="lede">Against this background, seven waves of the Perceptions of Peace Survey show respondents expressing both hope and fear about elections, alongside expectations of election-related violence.</p>
  </div>
</section>

<div class="story-layout">
  <StoryNav {sections} />
  <div class="story-flow">
    <section id="feelings" class="story-chapter home-story" tabindex="-1" aria-labelledby="opening-story-title">
      <p class="chapter-number">Question 1</p>
      <div class="home-story-heading">
        <h2 id="opening-story-title">How do elections make people feel?</h2>
        <p class="chapter-finding">Across the survey waves, many respondents expressed hope about elections. Fear and expectations of violence were also widespread.</p>
        <p>These are three separate questions. Reading them together reveals a tension in public attitudes, but does not tell us that every response came from the same people.</p>
      </div>
      <SummaryLollipop {data} />
      <div class="chapter-results three-results">
        <NarrativeQuestion data={narrative} questionId="elections_hopeful" compact />
        <NarrativeQuestion data={narrative} questionId="elections_afraid" compact />
        <NarrativeQuestion data={narrative} questionId="election_violence_risk" compact />
      </div>
    </section>

    <section id="readiness" class="story-chapter" tabindex="-1" aria-labelledby="readiness-title">
      <p class="chapter-number">Question 2</p>
      <h2 id="readiness-title">Do people feel ready for elections?</h2>
      <p class="chapter-finding">In the latest survey period, respondents were more likely to say that they personally felt prepared to vote than to say South Sudan was ready for elections.</p>
      <p>Personal preparedness and the country's readiness are different questions. Neither tells us whether a respondent is registered, has practical access to voting or will ultimately turn out.</p>
      <div class="chapter-results two-results">
        <NarrativeQuestion data={narrative} questionId="vote_prepared" />
        <NarrativeQuestion data={narrative} questionId="country_ready" />
      </div>
      <div class="chapter-subsection">
        <p class="subsection-label">Timing</p>
        <h3>When do respondents think elections should happen?</h3>
        <p>The answer choices changed as the election timetable changed. The latest distribution is shown in full, but the periods must not be joined into one continuous trend.</p>
        <p class="exact-question timing-question">“When should elections happen?”</p>
        <PeriodDistributions data={narrative} questionId="election_timing" />
        <ReadinessComparison data={narrative} />
      </div>
    </section>

    <section id="choices" class="story-chapter" tabindex="-1" aria-labelledby="choices-title">
      <p class="chapter-number">Question 3</p>
      <h2 id="choices-title">What shapes people's voting choices?</h2>
      <p class="chapter-finding">Most respondents in the latest period described their vote as an individual choice. Substantial minorities also agreed that members of a family or community should vote in the same way.</p>
      <p>These views are not mutually exclusive: a respondent could value individual choice while also feeling social expectations around voting.</p>
      <div class="chapter-results three-results">
        <NarrativeQuestion data={narrative} questionId="vote_individual" compact />
        <NarrativeQuestion data={narrative} questionId="vote_family" compact />
        <NarrativeQuestion data={narrative} questionId="vote_community" compact />
      </div>
      <div class="chapter-subsection">
        <p class="subsection-label">Candidates and priorities</p>
        <h3>Which choices do respondents say they could make?</h3>
        <div class="chapter-results two-results unequal-results">
          <NarrativeQuestion data={narrative} questionId="vote_ethnic_other" />
          <NarrativeQuestion data={narrative} questionId="issues_vote" showTrend={false} />
        </div>
      </div>
    </section>

    <section id="party-vision" class="story-chapter party-chapter" tabindex="-1" aria-labelledby="party-title">
      <p class="chapter-number">Question 4</p>
      <h2 id="party-title">Which parties do respondents think offer a vision?</h2>
      <p class="chapter-finding">Responses in the latest period were concentrated in the two largest named parties, while a sizeable group selected no party and respondents named a longer list of other parties.</p>
      <p>This is not a voting-intention question. It does not measure fixed party support or predict an election result.</p>
      <PartyVisionPanel data={narrative} />
      <aside class="party-warning"><strong>How to read the trend:</strong> only consistently identifiable named-party responses are compared. The early “SPLM” label is shown with later “SPLM-IG”. Earlier blank responses cannot be treated as “None of the parties”, so that response is not trended.</aside>
    </section>

    <section id="conditions" class="story-chapter conditions-chapter" tabindex="-1" aria-labelledby="conditions-title">
      <p class="chapter-number">Question 5</p>
      <h2 id="conditions-title">What could make elections credible—or unsafe?</h2>
      <p class="chapter-finding">The latest responses show mixed confidence in the conditions surrounding an election. Majorities agreed that parties could campaign freely and that the National Elections Commission could organise credible elections. Majorities also anticipated fraud and a return to full-scale war.</p>
      <p>These answers record respondents’ assessments and expectations. They are not an objective institutional evaluation or a prediction of what will happen.</p>
      <ConditionsPanel data={narrative} />
      <aside class="conditions-caution"><strong>Read these results separately:</strong> the four percentages come from different questions. The comparison does not establish that the same respondents expressed institutional confidence while also expecting fraud or war.</aside>
    </section>

    <section id="places" class="story-chapter places-chapter" tabindex="-1" aria-labelledby="places-title">
      <p class="chapter-number">Question 6</p>
      <h2 id="places-title">Where do views differ?</h2>
      <p class="chapter-finding">The overall picture is not the same in every surveyed location. Explore hope, perceived violence risk and national readiness in the most recent survey wave.</p>
      <p>Only surveyed locations are shown. Differences may reflect who was interviewed, the survey setting and local circumstances; they do not show that location caused an opinion or provide estimates for unsurveyed areas.</p>
      <StoryMap />
      <aside class="map-story-caution"><strong>Read small samples cautiously:</strong> no minimum sample-size threshold is applied to these three non-party questions. The valid response count is shown for every location; percentages based on few responses are less stable.</aside>
    </section>

  </div>
</div>
