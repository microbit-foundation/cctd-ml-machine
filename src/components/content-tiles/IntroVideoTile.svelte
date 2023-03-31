<script lang="ts">
import {t} from "../../i18n.js";
</script>

<p class="text-lg mb-2 font-semibold">
    {$t("content.index.videoHeading")}
</p>
<!-- svelte-ignore a11y-media-has-caption -->
<div class="flex items-center justify-center">
    <video class="h-[300px]" controls width=450 poster="imgs/data-trainer-thumpnail.png">
        <source src="https://mlmachine0video0storage.blob.core.windows.net/ml-machine-videos/Ultrabit_01_Introvideo_Datatræneren.mp4" type="video/mp4">
    </video>
</div>