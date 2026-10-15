import { mount } from 'svelte';
import '@fontsource/montserrat/latin-400.css';
import '@fontsource/montserrat/latin-500.css';
import '@fontsource/montserrat/latin-600.css';
import '@fontsource/montserrat/latin-700.css';
import '@fontsource/montserrat/latin-800.css';
import App from './App.svelte';
import './styles.css';

mount(App, { target: document.getElementById('app') });
