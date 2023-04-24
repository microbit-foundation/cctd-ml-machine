<script lang="ts">
  import UltrabitTheme, { UltrabitSmileyVariant } from '../../script/UltrabitTheme';

  export let variant:
    | 'neonYellow'
    | 'teal'
    | 'red'
    | 'darkBlue'
    | 'green'
    | 'pink'
    | 'sand'
    | 'lightBlue'
    | UltrabitSmileyVariant;
  export let transparent = false;
  export let size = 0;
  let pixels = '1.2rem';
  const smileySrc =
    UltrabitTheme.smileys[variant][transparent ? 'transparent' : 'opaque'];
  if (size) {
    pixels = String(size) + 'px';
  }
</script>

<img alt="" style="height: {pixels}; width: {pixels}" src="{smileySrc}" />
