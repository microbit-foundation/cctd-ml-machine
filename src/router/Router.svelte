<!--
  (c) 2025, Center for Computational Thinking and Design at Aarhus University and contributors
 
  SPDX-License-Identifier: MIT
 -->

<script lang="ts">
  import { onMount } from 'svelte';
  import { currentPath, navigate, Paths, type PathType } from './Router';
  import { currentPageComponent } from '../components/views/currentComponentStore';

  async function getRoutedComponent(path: PathType) {
    switch (path) {
      case Paths.HOME:
        return (await import('../pages/Homepage.svelte')).default;
      case Paths.VALIDATE:
        return (await import('../pages/ValidationPage.svelte')).default;
      case Paths.PLAYGROUND:
        return (await import('../pages/PlaygroundPage.svelte')).default;
      case Paths.DATA:
        return (await import('../pages/DataPage.svelte')).default;
      case Paths.TRAINING:
        return (await import('../pages/training/TrainingPage.svelte')).default;
      case Paths.MODEL:
        return (await import('../pages/model/ModelPage.svelte')).default;
      case Paths.FILTERS:
        return (await import('../pages/filter/FilterPage.svelte')).default;
    }
  }

  const onPathChange = (path: PathType) => {
    getRoutedComponent(path).then(comp => {
      currentPageComponent.set(comp);
    });
    let shouldPushState = true;

    const historyState = pathFromBrowserHistoryState(history.state);

    if (historyState !== undefined && historyState === path) {
      shouldPushState = false;
    }

    if (shouldPushState) {
      const url = window.location.origin + (path.startsWith('/') ? '' : '/') + path;
      history.pushState({ path: path }, '', url);
    }
  };

  const pathFromBrowserHistoryState = (state: unknown): PathType | undefined => {
    if (typeof state !== 'object' || state == null) {
      return undefined;
    }
    if (!('path' in state)) {
      return undefined;
    }
    if (typeof state.path !== 'string') {
      return undefined;
    }
    if (!Object.values(Paths).includes(state.path as PathType)) {
      return undefined;
    }
    return state.path as PathType;
  };

  const navigateFromUrl = () => {
    let urlPath = window.location.pathname;
    if (urlPath.startsWith('/')) {
      urlPath = urlPath.substring(1, urlPath.length);
    }
    let path: PathType = Paths.HOME;
    if (Object.values(Paths).includes(urlPath as PathType)) {
      path = urlPath as PathType;
      navigate(path);
    } else {
      history.replaceState({}, '', Paths.HOME);
    }
  };
  navigateFromUrl();

  $: onPathChange($currentPath);

  const onPopstateEvent = (event: PopStateEvent) => {
    const state: unknown = event.state;
    const path = pathFromBrowserHistoryState(state);
    if (path !== undefined) {
      navigate(path);
    }
  };

  onMount(() => {
    addEventListener('popstate', onPopstateEvent);
    return () => {
      removeEventListener('popstate', onPopstateEvent);
    };
  });
</script>

<slot />
