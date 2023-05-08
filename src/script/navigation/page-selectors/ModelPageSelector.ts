import PageSelectorStrategy from '../PageSelectorStrategy';
import ContentViewNavigator from '../ContentViewNavigator';
import Output from '../../../pages/Output.svelte';
import Menus, { MenuID } from '../Menus';

class ModelPageSelector extends PageSelectorStrategy {
  navigate(contentViewNavigation: ContentViewNavigator) {
    contentViewNavigation.setContentComponent(Output);
    Menus.openMenu(MenuID.MODEL);
  }
}

export default ModelPageSelector;
