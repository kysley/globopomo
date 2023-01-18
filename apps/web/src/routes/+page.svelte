<script lang="ts">
  import dayjs from "dayjs";
  import { onMount } from "svelte";
  import { timeDiff } from "../lib/utils";
  import { PUBLIC_SERVICE_URL } from "$env/static/public";

  // const;

  const steps = ["-", "\\", "|", "/"];
  let currentStep = 0;

  let paused = false;

  let interval: NodeJS.Timer;
  let globoState: {
    mode: "work" | "break";
    endsAt: number;
    config: { workDuration: number; breakDuration: number };
  };

  $: pomoTimeRemaining = "";
  $: percentage = 0;

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

  function swapInterval(config: typeof globoState) {
    if (interval) {
      clearInterval(interval);
    }
    // interval = undefined;
    globoState = config;
    startInterval();
  }

  function startInterval() {
    interval = setInterval(() => {
      const swapAt = dayjs(globoState?.endsAt);

      if (dayjs().to === swapAt) {
        console.log("swappinbg");
        const newMode = globoState.mode === "work" ? "break" : "work";
        swapInterval({
          mode: newMode,
          endsAt: dayjs()
            .add(
              globoState.config[
                newMode === "work" ? "breakDuration" : "workDuration"
              ] /
                1000 /
                60,
              "minutes"
            )
            .valueOf(),
          config: globoState.config,
        });
        return;
      }

      percentage =
        timeDiff(
          globoState.endsAt,
          globoState.mode === "work"
            ? globoState.config.workDuration
            : globoState.config.breakDuration
        ) * 100;

      pomoTimeRemaining = swapAt.fromNow(true);
      if (currentStep === steps.length - 1) {
        currentStep = 0;
      } else {
        currentStep++;
      }
    }, 1000);
  }

  onMount(async () => {
    const res = await fetchGlobo();
    globoState = res;

    startInterval();
  });
  // on
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
        >{globoState?.mode === "work" ? "working" : "on break"}</span
      >

      <p class="">
        <span>[{steps[currentStep]}]</span>...{pomoTimeRemaining}
      </p>
      <div>
        <button
          on:click={() =>
            swapInterval({
              mode: globoState.mode === "work" ? "break" : "work",
              endsAt: dayjs()
                .add(
                  globoState.config[
                    globoState.mode === "work"
                      ? "breakDuration"
                      : "workDuration"
                  ] /
                    1000 /
                    60,
                  "minutes"
                )
                .valueOf(),
              config: globoState.config,
            })}>[skip]</button
        >
        <button disabled on:click={console.log}>[pause]</button>
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
