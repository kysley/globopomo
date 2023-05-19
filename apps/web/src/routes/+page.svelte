<script lang="ts">
  import { onMount } from "svelte";
  import { PUBLIC_SERVICE_URL } from "$env/static/public";
  import { Globopomo } from "timer";
  import CreatePomo from "../lib/components/create-pomo.svelte";
  import { page } from "$app/stores";
  import { goto } from "$app/navigation";
  import PomoAction from "../lib/components/pomo-action.svelte";
  import SharePomo from "../lib/components/share-pomo.svelte";

  let timer: Globopomo | undefined = undefined;

  let interval: NodeJS.Timer;

  $: title = timer ? (timer.mode === "work" ? "working" : "on break") : "...";

  $: room = $page.url.searchParams.get("room");

  const fetchGlobo = async () => {
    let url = `${PUBLIC_SERVICE_URL}/pomo`;
    if (room) {
      url += `?room=${room}`;
    }
    const res = await fetch(url);
    return await res.json();
  };

  function setTimer(newTimer: Globopomo) {
    timer = newTimer;
  }

  async function syncGlobo() {
    const query = new URLSearchParams($page.url.searchParams);
    query.delete("room");
    goto(`?${query.toString()}`);
    // Update the URL without reloading the page
    await loadPomo();
  }

  function startInterval() {
    interval = setInterval(() => {
      timer = timer;
    }, 1000);
  }

  function handlePauseUnpause() {
    if (timer?.paused) {
      timer?.unpause();
    } else {
      timer?.pause();
    }

    timer = timer;
  }

  async function loadPomo() {
    try {
      const res = await fetchGlobo();
      timer = new Globopomo(res);
    } catch (e) {
      timer = new Globopomo({ breakDuration: 999, workDuration: 999 });
    } finally {
      startInterval();
    }
  }

  onMount(async () => {
    loadPomo();
  });
</script>

<svelte:head>
  <title>
    {title}
  </title>
  <meta name="description" content="Globopomo, a shared pomodoro timer" />
</svelte:head>

{#if timer}
  <section>
    <div class="container monospace">
      <span class="text-6xl" class:animated={timer.mode === "break"}
        >{timer.mode === "work" ? "working" : "on break"}</span
      >

      <p>
        *¯`·.{timer.getTimeRemaining()}.·´¯`°
      </p>
      <div>
        <PomoAction
          onClick={() => {
            timer?.skipMode();
            timer = timer;
          }}
          class="hover:text-blue-400">[skip]</PomoAction
        >
        <PomoAction onClick={handlePauseUnpause} class="hover:text-blue-400">
          [{timer?.paused ? "unpause" : "pause"}]
        </PomoAction>

        <PomoAction onClick={syncGlobo} class="hover:text-blue-400"
          >[sync]</PomoAction
        >

        <CreatePomo {setTimer} />
        {#if room}
          <SharePomo {room} />
        {/if}
      </div>
    </div>
  </section>
{/if}

<style>
  section {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  .container {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    border-radius: 24px;
  }

  .monospace {
    font-family: monospace;
  }
  @keyframes gradient {
    0% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
    100% {
      background-position: 0% 50%;
    }
  }
  .animated {
    background: linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab);
    background-size: 400% 400%;
    animation: gradient 25s ease infinite;
    background-clip: text;
    color: transparent;
  }

  button:hover {
    text-decoration: underline;
    color: mediumblue;
  }
</style>
