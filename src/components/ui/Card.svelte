<!--
  (c) 2025, Center for Computational Thinking and Design at Aarhus University and contributors
 
  SPDX-License-Identifier: MIT
 -->

<script lang="ts">
  export let elevated = false;
  export let mr = false;
  export let ml = false;
  export let small = false;
  export let validationPage = false;
</script>

<div
  class="border-1 border-solid rounded-xl"
  class:border-primaryborder={!validationPage}
  class:border-primaryborderaccent={validationPage}
  class:bg-backgroundlight={!validationPage}
  class:bg-primaryaccent={validationPage}
  class:bg-opacity-20={validationPage}
  class:h-30={small}
  class:h-36={!small}
  class:shadow-md={elevated}
  class:ml-2={ml && small}
  class:mr-2={mr && small}
  class:ml-5={ml && !small}
  class:mr-5={mr && !small}>
  <slot />
</div>
