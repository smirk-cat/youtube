<script lang="ts">
  import '../app.css'
  import favicon from '$lib/assets/favicon.svg'

  let { children, data } = $props()
</script>

<svelte:head>
  <link rel="icon" href={favicon} />
  <title>NekoTube</title>
</svelte:head>

<div class="px-8 py-14">
  <div class="fixed top-0 left-0 z-10 flex h-14 w-full items-center bg-neutral-900 px-8">
    <div class="flex w-1/3 items-center justify-start">
      <a href="/" class="flex items-center text-xl tracking-tight">
        <i class="i-tabler-brand-youtube-filled mr-1 h-7 w-7 text-red-400"></i>
        Premium
        <span class="ml-0.5 self-start text-xs text-neutral-400">US</span>
      </a>
    </div>

    <div class="flex w-1/3 items-center justify-center rounded-full bg-neutral-800">
      <i class="i-tabler-search mr-1.5 ml-2.5 h-5 w-5 text-neutral-400"></i>
      <input
        type="text"
        placeholder="Search"
        class="w-full border-none bg-transparent py-2 pr-4 pl-2 placeholder:text-neutral-500 focus:ring-0"
      />
    </div>

    <div class="flex w-1/3 items-center justify-end">
      <button
        aria-label="Notifications"
        class="mr-2 flex items-center rounded-full bg-neutral-800/0 px-2 py-2 text-sm font-semibold"
      >
        <i class="i-tabler-bell h-5 w-5 text-neutral-300"></i>
      </button>

      {#if data.user}
        <img src={data.user?.avatarUrl} alt={data.user.name} class="h-8 w-8 rounded-full" />
      {:else}
        <div class="h-8 w-8 rounded-full bg-neutral-800"></div>
      {/if}
    </div>
  </div>

  {@render children()}
</div>
