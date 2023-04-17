<script lang="ts">
  import { t } from '../../i18n';
</script>

<p class="text-lg mb-2 font-semibold">
  {$t('content.index.videoHeading')}
</p>
<!-- svelte-ignore a11y-media-has-caption -->
<div class="flex items-center justify-center">
  <video class="h-[300px]" controls width="450" poster="imgs/data-trainer-thumpnail.png">
    <source
      src="https://datatraener0dr0media-euno.streaming.media.azure.net/18233c69-2bc3-4b1b-9e2d-249e37b56307/Ultrabit_01_Introvideo_Datatræneren.mp4"
      type="video/mp4" />
  </video>
</div>
