<script lang="ts">
  import InformationBase from './InformationBase.svelte';
  import { getInfoBoxColors } from '../../script/InformationComponentUtility';

  export let iconText: string | undefined = undefined;
  export let underlineText = true;
  export let boxOffset: { x: number; y: number } = { x: 0, y: 0 };
  export let width = 300;
  export let titleText: string;
  export let bodyText: string;
  export let isLightTheme = true;

  const colors = getInfoBoxColors(isLightTheme);

  const textColor = colors.textColor;
</script>

<InformationBase
  isLightTheme="{isLightTheme}"
  text="{iconText}"
  underlineText="{underlineText}"
  boxOffset="{boxOffset}"
  width="{width}">
  <p class="font-bold text-left mb-1 mt-1 text-sm" style="color: {textColor}">
    {titleText}
  </p>
  <p
    class="text-sm text-left"
    style="color: {textColor}"
    class:blackText="{isLightTheme}"
    class:whiteText="{!isLightTheme}">
    {bodyText}
  </p>
</InformationBase>
