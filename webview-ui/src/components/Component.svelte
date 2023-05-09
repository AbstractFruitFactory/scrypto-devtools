<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import type { ComponentT } from "../../../src/types";
  import { shortenAddress } from "../utils";
  import Function from "./Function.svelte";

  export let component: ComponentT;

  const dispatch = createEventDispatcher();

  const callMethod = (params: { fn: string; args: string[] }) =>
    dispatch("callMethod", {
      componentAddress: component.address,
      fn: params.fn,
      args: params.args,
    });
</script>

<div class="component">
  <div class="address">{shortenAddress(component.address)}</div>

  {#each component.abi.abi.fns as fn}
    {#if fn.mutability === "Mutable"}
      <Function {fn} on:call={(e) => callMethod(e.detail)} />
    {/if}
  {/each}
</div>

<style>
  .component {
    margin-bottom: 1rem;
  }
  .address {
    font-size: large;
    font-weight: bold;
    margin-bottom: 0.5rem;
  }
</style>
