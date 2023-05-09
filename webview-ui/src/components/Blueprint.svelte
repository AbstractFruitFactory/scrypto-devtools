<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import type { BlueprintT } from "../../../src/types";
  import { isMethod } from "../utils";
  import Function from "./Function.svelte";

  export let blueprint: BlueprintT;

  const dispatch = createEventDispatcher();

  const callFunction = (params: { fn: string; args: string[] }) =>
    dispatch("callFunction", {
      packageAddress: blueprint.abi.package_address,
      blueprintName: blueprint.name,
      fn: params.fn,
      args: params.args,
    });
</script>

<div>
  {#each blueprint.abi.abi.fns as fn}
    {#if !isMethod(fn)}
      <Function {fn} on:call={(e) => callFunction(e.detail)} />
    {/if}
  {/each}
</div>

<style>
</style>
