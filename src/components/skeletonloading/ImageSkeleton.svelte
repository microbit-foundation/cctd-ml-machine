<script lang="ts">
	import Skeleton from "svelte-skeleton/Skeleton.svelte";

	export let alt: string;
	export let src: string;
	export let width: number | undefined = undefined;
	export let height: number | undefined = undefined;
	export let spin: boolean = false;
	export let castShadow: boolean = false;
	export let loadingColorPrimary: string | undefined = undefined;
	export let loadingColorSecondary: string | undefined = undefined;
	export let onLoaded: (() => void) | undefined = undefined;
	let hasLoaded = false;

	const onLoad = () => {
		if (onLoaded) {
			onLoaded();
		}
		hasLoaded = true;
	};

</script>

<img
	alt={alt}
	class:animate-duration-[10s]={spin}
	class:animate-spin={spin}
	class:hidden={!hasLoaded}
	class:shadow-md={castShadow}
	height={height}
	on:load={onLoad}
	src={src}
	width={width}
/>

{#if !hasLoaded}
	<div>
		<Skeleton height={height}
							width={width}
							primaryColor={loadingColorPrimary}
							secondaryColor={loadingColorSecondary} />
	</div>
{/if}