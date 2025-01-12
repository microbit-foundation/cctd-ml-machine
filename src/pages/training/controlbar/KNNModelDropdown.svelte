<script lang="ts">
  import StandardDropdownButton from '../../../components/buttons/StandardDropdownButton.svelte';
    import ModelRegistry from '../../../script/domain/ModelRegistry';
    import { selectModel } from '../TrainingPage';

  export let isSelected: boolean;
</script>

<StandardDropdownButton
  onClick={() => {selectModel(ModelRegistry.KNN)}}
  fillOnHover
  outlined={!isSelected}
  small>
  <p>KNN Model</p>
  <div slot="content">
    <p>Hello world</p>
  </div>
</StandardDropdownButton>
