/**
 * (c) 2023, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */

import App from './App.svelte';
import './appInsights';
import 'virtual:windi.css';

console.log('Envs:', process.env);

const app = new App({
  target: document.body,
});

export default app;
