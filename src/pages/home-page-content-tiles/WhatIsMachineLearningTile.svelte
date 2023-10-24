<!--
  (c) 2023, Center for Computational Thinking and Design at Aarhus University and contributors
 
  SPDX-License-Identifier: MIT
 -->

<script lang="ts">
  import { t } from '../../i18n';
</script>

<p class="text-lg mb-2 font-semibold">How does it work?</p>
<p>
    ml-machine.org/ trains neural networks to recognize patterns in the accelerometer
    data.
</p>
<ol class="list-decimal list-inside">
  <li class="mt-4">
    Your curated data examples of different gestures or movements (e.g., circle, shake,
    jumping, running) are analyzed by a machine learning algorithm in order to find
    patterns in the data that can be used to predict/guess if future data samples come
    from the micro:bit being moved in circles, shook, taped to the leg of the person
    jumping, etc.
  </li>
  <li class="mt-4">
    The machine learning algorithm makes a data representation of the data examples by
    calculating specific properties of each example, such as standard deviation, cumulated
    acceleration, and maximum value.
  </li>
  <li class="mt-4">
    In this data representation, the data examples are shown to a neural network trainer.
    The algorithm shows calculated properties for each example to the neural networks that
    “learn” from these examples by finding patterns between the examples.
  </li>
  <li class="mt-4">
    This training process results in a trained neural network (we also call it a machine
    learning model) that can guess/predict how the micro:bit is moved when the same
    properties (standard deviation, cumulated acceleration, maximum value, etc.) are
    calculated from the live accelerometer data.
  </li>
</ol>
