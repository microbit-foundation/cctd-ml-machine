/**
 * (c) 2023-2025, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */

import { SvelteComponent } from 'svelte';
import DataMenu from './DataMenu.svelte';
import NewTrainerMenu from './TrainingMenu.svelte';
import ModelMenu from './ModelMenu.svelte';
import ValidateMenu from './ValidateMenu.svelte';
import { Paths, type PathType } from '../../router/Router';
import { writable } from 'svelte/store';
import { Feature, hasFeature } from '../../lib/FeatureToggles';

export interface MenuProperties {
  title: string;
  infoBubbleTitle: string;
  infoBubbleContent: string;
  navigationPath: PathType;
  collapsedButtonContent: typeof SvelteComponent<any> | undefined;
  expandedButtonContent: typeof SvelteComponent<any>;
  additionalExpandPaths?: PathType[];
  tooltipOffset?: { x: number; y: number };
}

/**
 * Wrapper for the menu logic, use navigation if possible, this is for fine-grained control of menus.
 */
class Menus {
  private static menuStore = writable<MenuProperties[]>(
    hasFeature(Feature.MODEL_VALIDATION)
      ? [
          {
            title: 'menu.data.helpHeading',
            infoBubbleTitle: 'menu.data.helpHeading',
            infoBubbleContent: 'menu.data.helpBody',
            collapsedButtonContent: undefined,
            expandedButtonContent: DataMenu,
            navigationPath: Paths.DATA,
          },
          {
            title: 'menu.trainer.helpHeading',
            infoBubbleTitle: 'menu.trainer.helpHeading',
            infoBubbleContent: 'menu.trainer.helpBody',
            collapsedButtonContent: undefined,
            expandedButtonContent: NewTrainerMenu,
            navigationPath: Paths.TRAINING,
            additionalExpandPaths: [Paths.FILTERS],
          },
          {
            title: 'menu.validate.helpHeading',
            infoBubbleTitle: 'menu.validate.helpHeading',
            infoBubbleContent: 'menu.validate.helpBody',
            collapsedButtonContent: undefined,
            expandedButtonContent: ValidateMenu,
            navigationPath: Paths.VALIDATE,
            additionalExpandPaths: [],
          },
          {
            title: 'menu.model.helpHeading',
            infoBubbleTitle: 'menu.model.helpHeading',
            infoBubbleContent: 'menu.model.helpBody',
            collapsedButtonContent: undefined,
            expandedButtonContent: ModelMenu,
            navigationPath: Paths.MODEL,
            tooltipOffset: { x: -100, y: -250 },
          },
        ]
      : [
          {
            title: 'menu.data.helpHeading',
            infoBubbleTitle: 'menu.data.helpHeading',
            infoBubbleContent: 'menu.data.helpBody',
            collapsedButtonContent: undefined,
            expandedButtonContent: DataMenu,
            navigationPath: Paths.DATA,
          },
          {
            title: 'menu.trainer.helpHeading',
            infoBubbleTitle: 'menu.trainer.helpHeading',
            infoBubbleContent: 'menu.trainer.helpBody',
            collapsedButtonContent: undefined,
            expandedButtonContent: NewTrainerMenu,
            navigationPath: Paths.TRAINING,
            additionalExpandPaths: [Paths.FILTERS],
          },
          {
            title: 'menu.model.helpHeading',
            infoBubbleTitle: 'menu.model.helpHeading',
            infoBubbleContent: 'menu.model.helpBody',
            collapsedButtonContent: undefined,
            expandedButtonContent: ModelMenu,
            navigationPath: Paths.MODEL,
          },
        ],
  );

  public static getMenuStore() {
    return this.menuStore;
  }
}

export default Menus;
