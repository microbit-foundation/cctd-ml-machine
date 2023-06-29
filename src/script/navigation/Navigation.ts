// import { Writable, writable, derived } from 'svelte/store';
// import { SvelteComponent } from 'svelte';
// import FilterPage from '../../pages/filter/FilterPage.svelte';
// import Homepage from '../../pages/Homepage.svelte';
// import DataPage from '../../pages/DataPage.svelte';
// import TrainingPage from '../../pages/training/TrainingPage.svelte';
// import ModelPage from '../../pages/ModelPage.svelte';

// export enum Paths {
//   HOME = '/',
//   DATA = 'data',
//   TRAINING = 'training',
//   MODEL = 'model',
//   FILTERS = 'filters',
// }

// // This could be done more elegantly with a map, but that causes vite hot reloading
// // issues due to circular imports
// function getRoutedComponent(path: Paths) {
//   switch (path) {
//     case Paths.HOME:
//       return Homepage;
//     case Paths.DATA:
//       return DataPage;
//     case Paths.TRAINING:
//       return TrainingPage;
//     case Paths.MODEL:
//       return ModelPage;
//     case Paths.FILTERS:
//       return FilterPage;
//   }
//   // Hacky way of ensuring exhaustive switch statement (at compile time)
//   // since typescript does not have this by default.
//   const exhaustiveCheck: never = path;
//   // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
//   throw new Error(`Non Exhaustive switch. ${exhaustiveCheck} not handled.`);
// }

// const currentPage: Writable<{
//   currentPath: Paths;
//   currentComponent: typeof SvelteComponent;
// }> = writable({
//   currentPath: Paths.HOME,
//   currentComponent: Homepage,
// });

// export const currentPath = derived(currentPage, $currentPage => $currentPage.currentPath);

// export const currentComponent = derived(
//   currentPage,
//   $currentPage => $currentPage.currentComponent,
// );

// export function navigate(path: Paths) {
//   currentPage.set({
//     currentComponent: getRoutedComponent(path),
//     currentPath: path,
//   });
//   history.pushState({}, '', path);
// }
