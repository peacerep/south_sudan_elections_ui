<script>
  import { onMount } from 'svelte';

  export let sections = [];
  let active = sections[0]?.id;
  let open = false;
  let collapsed = false;

  $: activeLabel = sections.find((section) => section.id === active)?.shortLabel ?? 'Start';

  function follow(event, id) {
    event.preventDefault();
    open = false;
    const target = document.getElementById(id);
    if (!target) return;
    history.replaceState(null, '', `#${id}`);
    target.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
    target.focus({ preventScroll: true });
  }

  onMount(() => {
    const nodes = sections.map(({ id }) => document.getElementById(id)).filter(Boolean);
    const update = () => {
      const line = Math.min(window.innerHeight * 0.42, 260);
      let current = nodes[0]?.id;
      for (const node of nodes) if (node.getBoundingClientRect().top <= line) current = node.id;
      if (current) active = current;
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  });
</script>

<button
  class="story-nav-toggle"
  type="button"
  aria-controls="story-contents"
  aria-expanded={open}
  on:click={() => open = !open}
>On this page: {activeLabel}<span aria-hidden="true">{open ? '−' : '+'}</span></button>

<nav id="story-contents" class:open class:collapsed class="story-nav" aria-label="On this page">
  <button class="story-nav-collapse" type="button" aria-label={collapsed ? 'Expand chapter navigation' : 'Collapse chapter navigation'} title={collapsed ? 'Expand chapter navigation' : 'Collapse chapter navigation'} on:click={() => collapsed = !collapsed}><span aria-hidden="true">{collapsed ? '›' : '‹'}</span></button>
  <p>On this page</p>
  {#each sections as section, index}
    <a
      href={`#${section.id}`}
      class:active={active === section.id}
      aria-current={active === section.id ? 'location' : undefined}
      on:click={(event) => follow(event, section.id)}
    ><span>{index + 1}</span><b>{section.shortLabel}</b></a>
  {/each}
</nav>
