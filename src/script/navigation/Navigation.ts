import HomePageSelector from "./page-selectors/HomePageSelector";
import ContentViewNavigator from "./ContentViewNavigator";
import DataPageSelector from "./page-selectors/DataPageSelector";
import TrainingPageSelector from "./page-selectors/TrainingPageSelector";
import ModelPageSelector from "./page-selectors/ModelPageSelector";
import { Pages } from "./Pages";

/**
 * Navigates using a strategy pattern checkout navigation/page-selectors for strategies.
 */
class Navigation {
	private static readonly pageSelectorStrategies = new Map([
		[Pages.HOMEPAGE, new HomePageSelector()],
		[Pages.DATAPAGE, new DataPageSelector()],
		[Pages.TRAININGPAGE, new TrainingPageSelector()],
		[Pages.MODELPAGE, new ModelPageSelector()]
	]);

	public static setCurrentPage(page: Pages) {
		const selectorStrategy = this.pageSelectorStrategies.get(page);
		if (!selectorStrategy) {
			throw Error(`No selector could be found for the given page, ${page}`);
		}

		selectorStrategy.navigate(new ContentViewNavigator());
	}
}

export default Navigation;