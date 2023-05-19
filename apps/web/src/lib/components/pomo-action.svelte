<script lang="ts">
  export let onClick: () => void;
  let className = "";
  export { className as class };
</script>

<button on:click={onClick} class={className}><slot /></button>
