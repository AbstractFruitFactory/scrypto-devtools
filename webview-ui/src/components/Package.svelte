<script lang="ts">
  import type { BlueprintT, ComponentT, PackageT } from "../../../src/types";
  import { shortenAddress } from "../utils";
  import Blueprint from "./Blueprint.svelte";
  import Component from "./Component.svelte";
  import Dropdown from "./Dropdown.svelte";

  export let _package: PackageT;
  export let components: ComponentT[];

  let selectedBlueprint = _package.blueprints[0];

  $: visibleComponents = components.filter(
    (component) => component.abi.blueprint_name === selectedBlueprint.name
  );

  const selectBlueprint = (blueprint: BlueprintT) => {
    selectedBlueprint = blueprint;
  };
</script>

<div class="package">
  <h2>{shortenAddress(_package.address)}</h2>
  <div>
    <div class="blueprint-title">Blueprint</div>
    <div class="blueprint-content">
      <div class="blueprint-dropdown">
        <Dropdown>
          {#each _package.blueprints as blueprint}
            <option on:click={() => selectBlueprint(blueprint)} value={blueprint.name} on:keydown={() => {}}
              >{blueprint.name}</option
            >
          {/each}
        </Dropdown>
      </div>

      <Blueprint on:callFunction blueprint={selectedBlueprint} />
    </div>
  </div>
  <div>
    <div class="components-title">Components</div>
    <div class="components-content">
      {#each visibleComponents as component}
        <Component on:callMethod {component} />
      {/each}
    </div>
  </div>
</div>

<style>
  .package {
    display: grid;
    grid-template-columns: 20rem;
    grid-template-rows: 3rem auto auto;
    gap: 1rem;
  }

  .blueprint-content {
    padding: 0.5rem;
    background-color: rgba(255, 255, 255, 0.05);
  }

  .components-content {
    padding: 0.5rem;
    background-color: rgba(255, 255, 255, 0.05);
  }

  .blueprint-dropdown {
    width: 10rem;
    margin-bottom: 0.5rem;
  }

  .components-title {
    font-size: small;
    margin: 0.5rem 0;
  }

  .blueprint-title {
    font-size: small;
    margin: 0.5rem 0;
  }
</style>
