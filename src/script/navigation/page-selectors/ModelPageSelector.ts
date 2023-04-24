import PageSelectorStrategy from '../PageSelectorStrategy';
import ContentViewNavigator from '../ContentViewNavigator';
import Output from '../../../pages/Output.svelte';
import Menus from '../Menus';

class ModelPageSelector extends PageSelectorStrategy {
  navigate(contentViewNavigation: ContentViewNavigator) {
    contentViewNavigation.setContentComponent(Output);
    Menus.openMenu(2);
  }
}

export default ModelPageSelector;
