<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import type { BlueprintT } from "../../../src/types";
  import Accordion from "./Accordion.svelte";

  const dispatch = createEventDispatcher();

  export let fn: BlueprintT["abi"]["abi"]["fns"][number];

  const call = () => dispatch("call", { fn: fn.ident, args: inputs });

  const onInput = (e: any, i: number) => {
    inputs[i] = e.target.value;
  };

  let inputs: string[] = [];
</script>

<Accordion>
  <div class="summary" slot="summary">
    {`${fn.ident}`}
  </div>
  <div class="function">
    {#each fn.input.fields.named as param, i}
      <input class="input" placeholder={param[1].type} on:input={(e) => onInput(e, i)} />
    {/each}
    <vscode-button on:click={call} on:keypress={() => {}} class="button">Call</vscode-button>
  </div>
</Accordion>

<style>
  .function {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .summary {
    display: inline;
  }

  .input {
    height: 100%;
  }

  .button {
    height: 100%;
  }
</style>
