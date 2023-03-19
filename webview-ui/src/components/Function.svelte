<script lang="ts">
  import type { BlueprintT } from "../../../src/types";

  export let fn: BlueprintT["abi"]["abi"]["fns"][number];
</script>

<div class="function">
  {`${fn.ident}: `}
  {#each fn.input.fields.named as param}
    {param[0]}: <input placeholder={param[1].type} />
  {/each}
</div>

<style>
  .function {
    display: flex;
    flex-direction: row;
    justify-content: center;
    gap: 1rem;
  }
</style>
