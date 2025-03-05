<script lang="ts">
  import RecordingGraph from '../../components/graphs/recording/RecordingGraph.svelte';
  import type Gesture from '../../script/domain/stores/gesture/Gesture';

  export let gesture: Gesture;
  const recording = gesture.getRecordings()[0];
</script>

<div class="flex flex-row">
  <p>{$gesture.name}</p>
  <div class="min-w-40 w-40 min-h-20 h-20">
    <RecordingGraph {recording} />
  </div>
<div class="min-w-40 w-40 min-h-20 h-20">
    <RecordingGraph {recording} />
  </div><div class="min-w-40 w-40 min-h-20 h-20">
    <RecordingGraph {recording} />
  </div><div class="min-w-40 w-40 min-h-20 h-20">
    <RecordingGraph {recording} />
  </div><div class="min-w-40 w-40 min-h-20 h-20">
    <RecordingGraph {recording} />
  </div><div class="min-w-40 w-40 min-h-20 h-20">
    <RecordingGraph {recording} />
  </div><div class="min-w-40 w-40 min-h-20 h-20">
    <RecordingGraph {recording} />
  </div><div class="min-w-40 w-40 min-h-20 h-20">
    <RecordingGraph {recording} />
  </div><div class="min-w-40 w-40 min-h-20 h-20">
    <RecordingGraph {recording} />
  </div><div class="min-w-40 w-40 min-h-20 h-20">
    <RecordingGraph {recording} />
  </div><div class="min-w-40 w-40 min-h-20 h-20">
    <RecordingGraph {recording} />
  </div><div class="min-w-40 w-40 min-h-20 h-20">
    <RecordingGraph {recording} />
  </div><div class="min-w-40 w-40 min-h-20 h-20">
    <RecordingGraph {recording} />
  </div><div class="min-w-40 w-40 min-h-20 h-20">
    <RecordingGraph {recording} />
  </div>
</div>
