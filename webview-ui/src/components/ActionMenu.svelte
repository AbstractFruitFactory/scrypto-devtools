<script lang="ts">
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();

  const sendCreateAccountMessage = () => {
    dispatch("create-account");
  };

  const sendPublishMessage = () => {
    dispatch("publish-package");
  };
</script>

<div class="menu">
  <vscode-button on:click={sendCreateAccountMessage}>Create account</vscode-button>
  <vscode-button on:click={sendPublishMessage}>Publish new package</vscode-button>
</div>

<style>
  .menu {
    display: flex;
    flex-direction: row;
    justify-content: center;
    gap: 1rem;
  }
</style>
