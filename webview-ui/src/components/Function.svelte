<script lang="ts">
  import type { BlueprintT } from "../../../src/types";
  import Accordion from "./Accordion.svelte";

  export let fn: BlueprintT["abi"]["abi"]["fns"][number];
</script>

<Accordion>
  <div class="summary" slot="summary">
    {`${fn.ident}`}
  </div>
  <div class="function">
    {#each fn.input.fields.named as param}
      <input class="input" placeholder={param[1].type} />
    {/each}
    <vscode-button class="button">Call</vscode-button>
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
