<script lang="ts">
  import type { BlueprintT } from "../../../src/types";
  import { isMethod } from "../utils";
  import Function from "./Function.svelte";

  export let blueprint: BlueprintT;
</script>

<div>
  {#each blueprint.abi.abi.fns as fn}
    {#if !isMethod(fn)}
      <Function {fn} />
    {/if}
  {/each}
</div>

<style>
</style>
