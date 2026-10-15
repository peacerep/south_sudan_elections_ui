import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { readFileSync } from 'node:fs';

const firstStory = JSON.parse(
  readFileSync(new URL('./src/lib/data/first-story.json', import.meta.url), 'utf8')
);

const publicationGate = {
  name: 'publication-approval-gate',
  buildStart() {
    if (firstStory.review_status !== 'approved_for_publication' && process.env.DRAFT_COMPILE !== 'true') {
      throw new Error(
        `Production build blocked: evidence status is ${firstStory.review_status}. ` +
        'Approval must be recorded in the evidence build. Use build:draft only for local compile verification.'
      );
    }
  }
};

export default defineConfig(({ command }) => ({
  base: './',
  plugins: [svelte(), ...(command === 'build' ? [publicationGate] : [])]
}));
