<script lang="ts">
  import ControlBar from '../../components/control-bar/ControlBar.svelte';
</script>

<ControlBar expanded>
  <div class="flex flex-row flex-grow h-full bg-blue-200">
    <!--Left controlbar-->
    <div class="flex flex-col justify-center h-full self-center flex-1">
      <p class="text-center">Neural Network</p>
    </div>
    <!--Right controlbar-->
    <div class="flex flex-col justify-center h-full self-center flex-1">
      <p class="text-center">Neural Network</p>
    </div>
  </div>
</ControlBar>
