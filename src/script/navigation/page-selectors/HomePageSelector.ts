import PageSelectorStrategy from '../PageSelectorStrategy';
import ContentViewNavigator from '../ContentViewNavigator';
import Homepage from '../../../pages/Homepage.svelte';
import Menus from '../Menus';

class HomePageSelector extends PageSelectorStrategy {
  navigate(contentViewNavigation: ContentViewNavigator) {
    contentViewNavigation.setContentComponent(Homepage);
    Menus.closeMenus();
  }
}

export default HomePageSelector;
