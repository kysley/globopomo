<script lang="ts">
  import PomoAction from "./pomo-action.svelte";

  export let room: string;
  let showCopied = false;

  function copyRoomLink() {
    navigator.clipboard.writeText(window.location.href);
    showCopied = true;
    setTimeout(() => {
      showCopied = false;
    }, 1500);
  }
</script>

<PomoAction
  onClick={copyRoomLink}
  class="text-purple-500 hover:text-purple-700"
>
  [share room <span class="underline">{room}</span>]
</PomoAction>
