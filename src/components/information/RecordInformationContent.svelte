<script lang="ts">
  import { t } from "../../i18n";
  import ImageSkeleton from "../skeletonloading/ImageSkeleton.svelte";
</script>

<!-- TODO: Move when restructuring code-base -->

<div>

	<p class="font-bold text-sm mb-2">
		{$t("content.data.choice.header")}
	</p>
	<p class="text-sm">
		{$t("content.data.choice.body")}

	</p>
	<div class="relative w-full justify-start flex justify-around gap-1 mt-6 mb-2">
		<div class="w-full float-left">
			<ImageSkeleton alt="microbit recording guide"
										 height={134}
										 src="imgs/microbit_record_guide.svg"
										 width={200} />
		</div>
		<p class=" text-center absolute w-60px right-10px top-35px">{$t("content.index.recordButtonDescription")}</p>
	</div>
</div>