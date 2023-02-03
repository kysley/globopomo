<script lang="ts">
  import dayjs from "dayjs";
  import { onMount } from "svelte";
  import { timeDiff } from "../lib/utils";
  import { PUBLIC_SERVICE_URL } from "$env/static/public";
  import { PomoTimer } from "timer";

  let timer = new PomoTimer({});

  const steps = ["-", "\\", "|", "/"];
  let currentStep = 0;

  $: paused = timer.paused;

  let interval: NodeJS.Timer;
  let globoState: {
    mode: "work" | "break";
    endsAt: number;
    config: { workDuration: number; breakDuration: number };
  };

  $: title = globoState
    ? globoState?.mode === "work"
      ? "working"
      : "on break"
    : "...";

  const fetchGlobo = async () => {
    console.log(import.meta.env);
    const res = await fetch(PUBLIC_SERVICE_URL);
    return await res.json();
  };

  async function syncGlobo() {
    globoState = await fetchGlobo();
  }

  function startInterval() {
    timer.start();
    interval = setInterval(() => {
      timer = timer;
      // remainder = timer.remaining;
    }, 1000);
  }

  function handlePauseUnpause() {
    if (timer.paused) {
      timer.unpause();
    } else {
      timer.pause();
    }

    timer = timer;
  }

  onMount(async () => {
    const res = await fetchGlobo();
    globoState = res;

    startInterval();
  });
</script>

<svelte:head>
  <title>
    {title}
  </title>
  <meta name="description" content="Globopomo, a shared pomodoro timer" />
</svelte:head>

<section>
  <div class="container monospace">
    {#if globoState}
      <span class="text-6xl"
        >{timer.mode === "work" ? "working" : "on break"}</span
      >

      <p>
        <span>[{steps[currentStep]}]</span>...{timer.remaining}
      </p>
      <div>
        <button
          on:click={() => {
            timer.switch();
            timer = timer;
          }}>[skip]</button
        >
        <button on:click={handlePauseUnpause}
          >[{paused ? "unpause" : "pause"}]</button
        >
        <button on:click={syncGlobo}>[sync]</button>
      </div>
    {:else}
      <span class="text-6xl">waking up...</span>
    {/if}
  </div>

  <!-- <Counter /> -->
</section>
<section />

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
</style>
