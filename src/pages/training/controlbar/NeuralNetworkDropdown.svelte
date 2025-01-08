<script lang="ts">
  import RangeSlider from 'svelte-range-slider-pips';
  import StandardDropdownButton from '../../../components/buttons/StandardDropdownButton.svelte';
  import windi from './../../../../windi.config.js';

  export let isSelected: boolean;
  const color = windi.theme.extend.colors.primary;
</script>

<StandardDropdownButton fillOnHover outlined={!isSelected} small>
  <p>KNN Model</p>

  <div slot="content">
    <div class="flex flex-col">
      <div class="grid grid-cols-[1fr,1fr]">
          <p class="whitespace-nowrap content-center">Learning rate</p>
        <div class="w-25 flex flex-col justify-center" style="font-size:0.6rem; --range-handle-inactive: {color}; --range-handle: {color}; --range-handle-focus: {color}">
          <RangeSlider
            min={0.01}
            max={1.5}
            float
            step={0.01}
            springValues={{ damping: 0.9, stiffness: 0.5, precision: 0.1 }}  />
        </div>
      </div>
    </div>
  </div>
</StandardDropdownButton>
