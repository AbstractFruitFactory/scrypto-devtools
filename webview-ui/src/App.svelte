<script lang="ts">
  import { provideVSCodeDesignSystem, vsCodeButton } from "@vscode/webview-ui-toolkit";
  import type { BlueprintT, ComponentT, PackageT } from "../../src/types";
  import ActionMenu from "./components/ActionMenu.svelte";
  import Package from "./components/Package.svelte";
  import { postMessageToExtension } from "./utilities/postMessage";

  // In order to use the Webview UI Toolkit web components they
  // must be registered with the browser (i.e. webview) using the
  // syntax below.
  provideVSCodeDesignSystem().register(vsCodeButton());

  // To register more toolkit components, simply import the component
  // registration function and call it from within the register
  // function, like so:
  //
  // provideVSCodeDesignSystem().register(
  //   vsCodeButton(),
  //   vsCodeCheckbox()
  // );
  //
  // Finally, if you would like to register all of the toolkit
  // components at once, there's a handy convenience function:
  //
  // provideVSCodeDesignSystem().register(allComponents.register());

  let _package: PackageT;
  let components: ComponentT[] = [];

  const handlePackagePublished = (payload: PackageT) => {
    _package = payload;
  };

  const handleComponentLoaded = (payload: ComponentT) => {
    components = [...components, payload];
  };

  const handlePackageSelected = (payload: PackageT) => {
    console.log("handlePackageSelected", payload)
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
