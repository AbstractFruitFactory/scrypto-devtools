<script lang="ts">
  import { provideVSCodeDesignSystem, vsCodeButton, vsCodeDropdown } from "@vscode/webview-ui-toolkit";
  import type { BlueprintT, ComponentT, PackageT } from "../../src/types";
  import ActionMenu from "./components/ActionMenu.svelte";
  import Package from "./components/Package.svelte";
  import { postMessageToExtension } from "./utilities/postMessage";

  [vsCodeButton(), vsCodeDropdown()].forEach((e) => provideVSCodeDesignSystem().register(e));

  let _package: PackageT;
  let components: ComponentT[] = [];

  const handlePackagePublished = (payload: PackageT) => {
    _package = payload;
  };

  const handleComponentLoaded = (payload: ComponentT) => {
    components = [...components, payload];
  };

  const handlePackageSelected = (payload: PackageT) => {
    _package = payload;
  };

  window.addEventListener("message", (event) => {
    ({
      "package-published": handlePackagePublished,
      "component-loaded": handleComponentLoaded,
      "package-selected": handlePackageSelected,
    })[event.data.type](event.data.payload);
  });

  const createAccount = () => {
    postMessageToExtension({
      type: "create-account",
      content: {},
    });
  };

  const publishPackage = () => {
    postMessageToExtension({
      type: "publish-package",
      content: {},
    });
  };

  const instantiateBlueprint = (blueprint: BlueprintT) => {
    postMessageToExtension({
      type: "instantiate-blueprint",
      content: { blueprint },
    });
  };
</script>

<main>
  <ActionMenu on:create-account={createAccount} on:publish-package={publishPackage} />
  {#if _package}
    <Package on:instantiate-blueprint={(e) => instantiateBlueprint(e.detail)} {_package} {components} />
  {/if}
</main>

<style>
  :global(*) {
    overflow-wrap: break-word;
    box-sizing: border-box;
  }
  
  main {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    height: 100%;
  }

  main > * {
    margin: 1rem 0;
  }
</style>
