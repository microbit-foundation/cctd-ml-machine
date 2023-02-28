import { writable, type Writable } from "svelte/store";
import Homepage from "../../pages/Homepage.svelte";
import { SvelteComponent } from "svelte";

export const currentContentComponent: Writable<typeof SvelteComponent> = writable(Homepage);

export class ContentViewNavigator {
	public setContentComponent(component: typeof SvelteComponent) {
		currentContentComponent.set(component);
	}
}

export default ContentViewNavigator;