import ContentViewNavigator from "./ContentViewNavigator";

abstract class PageSelectorStrategy {
	abstract navigate(contentViewNavigation: ContentViewNavigator): void;
}

export default PageSelectorStrategy;