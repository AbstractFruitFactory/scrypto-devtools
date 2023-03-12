<script lang="ts">
  import { provideVSCodeDesignSystem, vsCodeButton } from "@vscode/webview-ui-toolkit";
  import type { AccountT } from "../../src/types";
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

  function createAccount() {
    postMessageToExtension({
      type: "create-account",
      content: {},
    })
  }
</script>

<main>
  <vscode-button on:click={createAccount}>Create account</vscode-button>
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
