<!--
  (c) 2023, Center for Computational Thinking and Design at Aarhus University and contributors
 
  SPDX-License-Identifier: MIT
 -->

<script lang="ts">
  import { t } from '../../i18n';
  import ImageSkeleton from '../../components/skeletonloading/ImageSkeleton.svelte';

  const MLStepsContent: { image: string; text: string }[] = [
    {
      image: '/imgs/model_green.svg',
      text: 'content.index.MLExplainer1',
    },
    {
      image: '/imgs/data_representation.svg',
      text: 'content.index.MLExplainer2',
    },
    {
      image: '/imgs/ML_train.svg',
      text: 'content.index.MLExplainer3',
    },
    {
      image: '/imgs/ML_predict.svg',
      text: 'content.index.MLExplainer4',
    },
  ];
</script>

<p class="text-lg mb-2 font-semibold">{$t('content.index.MLHeading')}</p>
<p>
  {$t('content.index.MLSubheading')}
</p>
<ol class="list-none list-inside">
  {#each MLStepsContent as step}
    <li class="mt-4 flex item-start gap-2">
      <ImageSkeleton alt="microbit guide" height={70} src={step.image} width={70} />

      <p>
        {$t(step.text)}
      </p>
    </li>
  {/each}
</ol>
