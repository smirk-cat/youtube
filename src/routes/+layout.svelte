<script lang="ts">
  import '../app.css'
  import favicon from '$lib/assets/favicon.svg'

  let { children, data } = $props()
  import { resolve } from '$app/paths'
  import { SearchBox } from '$lib/features/yt/search'
</script>

<svelte:head>
  <link rel="icon" href={favicon} />
  <title>NekoTube</title>
</svelte:head>

<div class="px-8 py-16">
  <div class="fixed top-0 left-0 z-10 flex h-14 w-full items-center bg-neutral-900 px-8">
    <div class="flex w-1/3 items-center justify-start">
      <a href={resolve('/')} class="flex items-center text-xl tracking-tight">
        <i class="mr-1 i-tabler-brand-youtube-filled h-7 w-7 text-red-400"></i>
        Premium
        <span class="ml-0.5 self-start text-xs text-neutral-400">US</span>
      </a>
    </div>

    <div class="w-1/3">
      <SearchBox />
    </div>

    <div class="flex w-1/3 items-center justify-end">
      {#if data.user}
        <button
          aria-label="Notifications"
          class="relative mr-2 flex items-center rounded-full bg-neutral-800/0 px-2 py-2 text-sm font-semibold"
        >
          <i class="i-tabler-bell h-5 w-5 text-neutral-300"></i>

          {#if data.user.notificationsCount > 0}
            <span
              class="absolute -top-1 -right-1 flex h-4 items-center justify-center rounded-full bg-red-400 px-1 text-xs text-neutral-950"
            >
              {data.user.notificationsCount}
            </span>
          {/if}
        </button>

        <img src={data.user?.avatarUrl} alt={data.user.name} class="h-8 w-8 rounded-full" />
      {:else}
        <div class="h-8 w-8 rounded-full bg-neutral-800"></div>
      {/if}
    </div>
  </div>

  {@render children()}
</div>
