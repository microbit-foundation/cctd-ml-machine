import { SvelteComponent } from 'svelte';
import { get, writable } from 'svelte/store';
import GestureMenu from '../../menus/DataMenu.svelte';
import NewTrainerMenu from '../../menus/TrainingMenu.svelte';
import NewModelMenu from '../../menus/ModelMenu.svelte';
import { Paths } from './Navigation'
// import { Paths } from './Paths'
// import { Pages } from './Pages';
// import { Paths } from './Navigation'

export type MenuProperties = {
  title: string;
  infoBubbleTitle: string;
  infoBubbleContent: string;
  navigationPath: Paths;
  collapsedButtonContent: typeof SvelteComponent | undefined;
  expandedButtonContent: typeof SvelteComponent;
  additionalExpandPages?: Paths[]
};

/**
 * Wrapper for the menu logic, use navigation if possible, this is for fine-grained control of menus.
 */
class Menus {
  private static currentlyOpen = writable(-1);

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
      additionalExpandPages: [Paths.FILTERS]
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

  // public static getOpenMenu() {
  //   if (get(this.currentlyOpen) == -1) {
  //     throw new Error('No menu have been opened');
  //   }
  //   return get(this.menuStore)[get(this.currentlyOpen)];
  // }

  // public static getOpenMenuId() {
  //   return this.currentlyOpen;
  // }

  // public static openMenu(id: MenuID) {
  //   this.currentlyOpen.set(id);
  // }

  // public static closeMenus() {
  //   this.currentlyOpen.set(-1);
  // }

  public static getMenuStore() {
    return this.menuStore;
  }

  // public static addMenu(menu: MenuProperties) {
  //   this.menuStore.update(u => {
  //     u.push(menu);
  //     return u;
  //   });
  // }
}

export default Menus;
