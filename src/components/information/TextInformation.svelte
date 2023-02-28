<script lang="ts">
  import InformationBase from "./InformationBase.svelte";

  export let iconText: string | undefined = undefined
  export let underlineText = true
  export let boxOffset: {x: number, y: number} = {x: 0, y: 0}
  export let width = 300
  export let titleText: string
  export let bodyText: string
  export let isLightTheme = true

</script>

<InformationBase
  text={iconText}
  underlineText={underlineText}
  boxOffset={boxOffset}
  width={width}
  backgroundColor={isLightTheme ? "rgba(231, 229, 228, 1)" : "rgba(87, 83, 78, 1)"}
  iconColor={isLightTheme ? "rgba(255,255,255,0.5)" : "rgba(160,160,160,1)"}
  iconTextColor={isLightTheme ? "rgba(255,255,255,1)" : "rgba(160,160,160,1)"}
  
  >
  <p 
    class="font-bold text-left mb-1 mt-1 text-sm"
    class:blackText={isLightTheme}
    class:whiteText={!isLightTheme}
    >
    {titleText}
  </p>
  <p 
    class="text-sm text-left"
    class:blackText={isLightTheme}
    class:whiteText={!isLightTheme}
    >
    {bodyText}
  </p>

</InformationBase>

<style>
  .blackText {
    color: black
  }
  .whiteText {
    color: white
  }

</style>