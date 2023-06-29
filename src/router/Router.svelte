<script lang="ts">
  import { onMount } from 'svelte';
  import DataPage from '../pages/DataPage.svelte';
  import Homepage from '../pages/Homepage.svelte';
  import ModelPage from '../pages/ModelPage.svelte';
  import FilterPage from '../pages/filter/FilterPage.svelte';
  import TrainingPage from '../pages/training/TrainingPage.svelte';
  import { currentPageComponent } from '../views/currentComponentStore';
  import { currentPath, navigate, Paths, PathType } from './paths';

  function getRoutedComponent(path: PathType) {
    switch (path) {
      case Paths.HOME:
        return Homepage;
      case Paths.DATA:
        return DataPage;
      case Paths.TRAINING:
        return TrainingPage;
      case Paths.MODEL:
        return ModelPage;
      case Paths.FILTERS:
        return FilterPage;
    }
    // Hacky way of ensuring exhaustive switch statement (at compile time)
    // since typescript does not have this by default.
    const exhaustiveCheck: never = path;
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    throw new Error(`Non Exhaustive switch. ${exhaustiveCheck} not handled.`);
  }

  const onPathChange = (path: PathType) => {
    currentPageComponent.set(getRoutedComponent(path));
    let shouldPushState = true;

    const historyState = pathFromBrowserHistoryState(history.state);

    if (historyState !== undefined && historyState === path) {
      shouldPushState = false;
    }

    if (shouldPushState) {
      history.pushState({ path: path }, '', path);
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
