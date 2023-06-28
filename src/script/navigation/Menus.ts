import { SvelteComponent } from 'svelte';
import { writable } from 'svelte/store';
import GestureMenu from '../../menus/DataMenu.svelte';
import NewTrainerMenu from '../../menus/TrainingMenu.svelte';
import NewModelMenu from '../../menus/ModelMenu.svelte';
import { Paths } from './Navigation'

export type MenuProperties = {
  title: string;
  infoBubbleTitle: string;
  infoBubbleContent: string;
  navigationPath: Paths;
  collapsedButtonContent: typeof SvelteComponent | undefined;
  expandedButtonContent: typeof SvelteComponent;
  additionalExpandPaths?: Paths[]
};

/**
 * Wrapper for the menu logic, use navigation if possible, this is for fine-grained control of menus.
 */
class Menus {

  private static menuStore = writable<MenuProperties[]>([
    {
      title: 'menu.data.helpHeading',
      infoBubbleTitle: 'menu.data.helpHeading',
      infoBubbleContent: 'menu.data.helpBody',
      collapsedButtonContent: undefined,
      expandedButtonContent: GestureMenu,
      navigationPath: Paths.DATA,
    },
    {
      title: 'menu.trainer.helpHeading',
      infoBubbleTitle: 'menu.trainer.helpHeading',
      infoBubbleContent: 'menu.trainer.helpBody',
      collapsedButtonContent: undefined,
      expandedButtonContent: NewTrainerMenu,
      navigationPath: Paths.TRAINING,
      additionalExpandPaths: [Paths.FILTERS]
    },
    {
      title: 'menu.model.helpHeading',
      infoBubbleTitle: 'menu.model.helpHeading',
      infoBubbleContent: 'menu.model.helpBody',
      collapsedButtonContent: undefined,
      expandedButtonContent: NewModelMenu,
      navigationPath: Paths.MODEL,
    },
  ]);

  public static getMenuStore() {
    return this.menuStore;
  }

}

export default Menus;
