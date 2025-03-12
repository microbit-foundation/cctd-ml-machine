<script lang="ts">
  import GestureCard from '../../components/GestureCard.svelte';
  import type Gesture from '../../script/domain/stores/gesture/Gesture';

  export let gesture: Gesture;
</script>

<GestureCard small>
  <div class="self-center px-4 flex flex-col h-full relative justify-center">
    <div>
      <div
        class="flex-grow text-center font-semibold rounded-xl border border-gray-300 border-solid px-4">
        <p>{$gesture.name}</p>
      </div>
    </div>
    <!-- DOT -->
    <div
      class="absolute rounded-full w-3 h-3 m-3 top-0 left-0"
      style={`background-color:${gesture.getColor()}`}>
    </div>
  </div>
</GestureCard>
