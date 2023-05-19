<script lang="ts">
  import { goto } from "$app/navigation";
  import { PUBLIC_SERVICE_URL } from "$env/static/public";
  import { Globopomo } from "timer";
  import PomoAction from "./pomo-action.svelte";
  export let setTimer: (timer: Globopomo) => void;

  let breakDuration: number;
  let workDuration: number;
  let room: string;
  let creating: boolean = false;
  let showCopied: boolean = false;

  async function create() {
    if (!creating) {
      creating = true;
      return;
    }
    const res = await fetch(`${PUBLIC_SERVICE_URL}/create`, {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({ workDuration, breakDuration }),
    });
    const data = await res.json();
    room = data.uid;
    creating = false;
    setTimer(new Globopomo({ breakDuration, workDuration }));

    goto(`?${new URLSearchParams({ room })}`);
  }
</script>

{#if creating}
  <input
    bind:value={workDuration}
    placeholder="work duration"
    class="text-black placeholder-black"
  />
  <input
    bind:value={breakDuration}
    placeholder="break duration"
    class="text-black placeholder-black"
  />
{/if}

<PomoAction onClick={create} class="text-green-500 hover:text-green-700"
  >[create]</PomoAction
>
