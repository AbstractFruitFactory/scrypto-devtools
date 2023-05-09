<script lang="ts">
  import { provideVSCodeDesignSystem, vsCodeButton, vsCodeDropdown } from "@vscode/webview-ui-toolkit";
  import type { ComponentT, PackageT } from "../../src/types";
  import ActionMenu from "./components/ActionMenu.svelte";
  import Package from "./components/Package.svelte";
  import { postMessageToExtension } from "./utilities/postMessage";

  [vsCodeButton(), vsCodeDropdown()].forEach((e) => provideVSCodeDesignSystem().register(e));

  let _package: PackageT;
  let components: ComponentT[] = [];

  /*
  const handlePackagePublished = (payload: PackageT) => {
    _package = payload;
  };
  */

  const handleLedgerLoaded = () => {
    components = [];
  };

  const handleComponentLoaded = (payload: ComponentT) => {
    if (components.find((c) => c.address === payload.address)) return;
    components = [...components, payload];
  };

  const handlePackageSelected = (payload: PackageT) => {
    if (_package?.address === payload.address) return;
    _package = payload;
  };

  window.addEventListener("message", (event) => {
    ({
      //"package-published": handlePackagePublished,
      "ledger-loaded": handleLedgerLoaded,
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

  const reset = () => {
    _package = undefined;
    components = [];
    postMessageToExtension({
      type: "reset",
      content: {},
    });
  };

  const callFunction = (params: {
    packageAddress: string;
    blueprintName: string;
    fn: string;
    args: string[];
  }) => {
    postMessageToExtension({
      type: "call-function",
      content: params,
    });
  };

  const callMethod = (params: { componentAddress: string; fn: string; args: string[] }) => {
    postMessageToExtension({
      type: "call-method",
      content: params,
    });
  };
</script>

<main>
  <ActionMenu on:create-account={createAccount} on:publish-package={publishPackage} on:reset={reset} />
  {#if _package}
    <Package
      on:callFunction={(e) => callFunction(e.detail)}
      on:callMethod={(e) => callMethod(e.detail)}
      {_package}
      {components}
    />
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
