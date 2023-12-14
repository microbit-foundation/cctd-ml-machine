<!--
  (c) 2023, Center for Computational Thinking and Design at Aarhus University and contributors
 
  SPDX-License-Identifier: MIT
 -->

<script lang="ts">
  import { liveAccelerometerData } from '../../script/stores/Stores';

  let utilization = 0;
  setInterval(() => {
    utilization = liveAccelerometerData.getBuffer().getBufferUtilization();
  }, 1000);
</script>

<p>Buffer utilization = {utilization * 100}%</p>
<p class="text-sm">
  Buffer utilization should be about 20-50%. Too high means performance spikes may cause
  the buffer to lack sufficient data to classify. Too low means performance is wasted
</p>
