import PageSelectorStrategy from '../PageSelectorStrategy';
import ContentViewNavigator from '../ContentViewNavigator';
import DataPage from '../../../pages/DataPage.svelte';
import Menus, { MenuID } from '../Menus';

class DataPageSelector extends PageSelectorStrategy {
  navigate(contentViewNavigation: ContentViewNavigator) {
    contentViewNavigation.setContentComponent(DataPage);
    Menus.openMenu(MenuID.DATA);
  }
}

export default DataPageSelector;
