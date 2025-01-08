<script lang="ts">
  import StandardDropdownButton from '../../../components/buttons/StandardDropdownButton.svelte';

  export let isSelected: boolean;
</script>

<StandardDropdownButton
  fillOnHover
  outlined={!isSelected}
  small>
  <p>Neural Network</p>
  <div slot="content">
    <p>Hello world</p>
  </div>
</StandardDropdownButton>
