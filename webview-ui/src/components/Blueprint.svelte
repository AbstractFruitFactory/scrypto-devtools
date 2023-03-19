<script lang="ts">
  import type { BlueprintT } from "../../../src/types";
  import { isInstantiationFunction, isMethod } from "../utils";
  import Function from "./Function.svelte";
  import { createEventDispatcher } from "svelte";

  export let blueprint: BlueprintT;

  const dispatch = createEventDispatcher();

  const sendInstantiateMessage = () => {
    dispatch("instantiate-blueprint", blueprint);
  };
</script>

<div class="blueprint" on:click>
  <div class="title">
    <h3>{blueprint.name}</h3>
    <vscode-button on:click={sendInstantiateMessage}>Instantiate</vscode-button>
  </div>
  {#each blueprint.abi.abi.fns as fn}
    {#if !isInstantiationFunction(blueprint.abi, fn) && !isMethod(fn)}
      <Function {fn} />
    {/if}
  {/each}
</div>

<style>
  .blueprint {
    background-color: rgba(255, 255, 255, 0.2);
    border-radius: 0.5rem;
    padding: 1rem;
  }

  .title {
    display: flex;
    flex-direction: row;
    justify-content: center;
    gap: 1rem;
  }
</style>
