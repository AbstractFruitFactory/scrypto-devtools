<script lang="ts">
  import type { BlueprintT, ComponentT, PackageT } from "../../../src/types";
  import Blueprint from "./Blueprint.svelte";
  import Component from "./Component.svelte";

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
  <h2 class="address">{_package.address}</h2>
  <div class="blueprints">
    {#each _package.blueprints as blueprint}
      <Blueprint on:click={() => selectBlueprint(blueprint)} on:instantiate-blueprint {blueprint} />
    {/each}
  </div>
  <div class="components">
    {#each visibleComponents as component}
      <Component {component} />
    {/each}
  </div>
</div>

<style>
  .package {
    display: grid;
    grid:
      "address    address"
      "blueprints components";
    gap: 4rem;
    width: 100%;
  }

  .address {
    grid-area: address;
  }

  .blueprints {
    grid-area: blueprints;
    display: flex;
    flex-direction: column;
  }

  .components {
    grid-area: components;
  }
</style>
