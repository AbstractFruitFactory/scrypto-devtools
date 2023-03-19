<script lang="ts">
  import type { ComponentT } from "../../../src/types";
  import Function from "./Function.svelte";

  export let component: ComponentT;
</script>

<h3>{component.address}</h3>
{#each component.abi.abi.fns as fn}
  {#if fn.mutability === "Mutable"}
    <Function {fn} />
  {/if}
{/each}
