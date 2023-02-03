<script lang="ts">
  import dayjs from "dayjs";
  import { onMount } from "svelte";
  import { PUBLIC_SERVICE_URL } from "$env/static/public";
  import { PomoTimer } from "timer";

  let timer: PomoTimer | undefined = undefined;
  const steps = ["-", "\\", "|", "/"];
  let currentStep = 0;

  $: paused = timer?.paused;

  let interval: NodeJS.Timer;

  $: title = timer ? (timer.mode === "work" ? "working" : "on break") : "...";

  const fetchGlobo = async () => {
    console.log(import.meta.env);
    const res = await fetch(PUBLIC_SERVICE_URL);
    return await res.json();
  };

  async function syncGlobo() {
    await loadPomo();
  }

  function startInterval() {
    timer?.start();
    interval = setInterval(() => {
      timer = timer;
      // remainder = timer.remaining;
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
      timer = new PomoTimer({ mode: res.mode, initAt: dayjs(res.initAt) });
    } catch (e) {
      timer = new PomoTimer({});
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
        <!-- <span>[{steps[currentStep]}]</span -->
        *¯`·.{timer.remaining}.·´¯`°
      </p>
      <div>
        <button
          on:click={() => {
            timer?.switch();
            timer = timer;
          }}>[skip]</button
        >
        <button on:click={handlePauseUnpause}
          >[{paused ? "unpause" : "pause"}]</button
        >
        <button on:click={syncGlobo}>[sync]</button>
      </div>
    </div>

    <!-- <Counter /> -->
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
