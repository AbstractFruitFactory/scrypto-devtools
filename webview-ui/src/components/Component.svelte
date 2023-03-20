<script lang="ts">
  import type { ComponentT } from "../../../src/types";
  import { shortenAddress } from "../utils";
  import Function from "./Function.svelte";

  export let component: ComponentT;
</script>

<div>
  <div class="address">{shortenAddress(component.address)}</div>

  {#each component.abi.abi.fns as fn}
    {#if fn.mutability === "Mutable"}
      <Function {fn} />
    {/if}
  {/each}
</div>

<style>
  .address {
    font-size: large;
    font-weight: bold;
    margin-bottom: 0.5rem;
  }
</style>
