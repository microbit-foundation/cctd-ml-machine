import PageSelectorStrategy from '../PageSelectorStrategy';
import ContentViewNavigator from '../ContentViewNavigator';
import DataPage from '../../../pages/DataPage.svelte';
import Menus from '../Menus';

class DataPageSelector extends PageSelectorStrategy {
  navigate(contentViewNavigation: ContentViewNavigator) {
    contentViewNavigation.setContentComponent(DataPage);
    Menus.openMenu(0);
  }
}

export default DataPageSelector;
