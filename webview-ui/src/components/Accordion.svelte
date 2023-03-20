<script lang="ts">
  let isOpen = false;

  const toggle = () => (isOpen = !isOpen);
</script>

<div class:no-bottom-border={isOpen} class="button" on:click={toggle} on:keydown={toggle}>
  <svg
    style="tran"
    width="20"
    height="20"
    fill="none"
    stroke-linecap="round"
    stroke-linejoin="round"
    stroke-width="2"
    viewBox="0 0 24 24"
    stroke="currentColor"
    style:transform={isOpen ? "rotate(0.25turn)" : ""}
  >
    <path d="M9 5l7 7-7 7" />
  </svg>
  <div class="summary">
    <slot name="summary" />
  </div>
</div>
{#if isOpen}
  <div class="content">
    <slot />
  </div>
{/if}

<style>
  .button {
    display: flex;
    align-items: center;
    cursor: pointer;
    border: 1px solid #ccc;
    border-radius: 0.25rem;
    padding-left: 0.25rem;
  }

  .no-bottom-border {
    border-bottom: none;
  }
  .summary {
    border: none;
    background: none;
    display: inline;
    cursor: pointer;
    font-size: medium;
    margin: 0;
    padding-bottom: 0.5em;
    padding-top: 0.5em;
  }

  .content {
    border: 1px solid #ccc;
    border-top: none;
    border-radius: 0.25rem;
    padding: 0.5rem;
  }

  svg {
    transition: transform 0.2s ease-in;
  }
</style>
