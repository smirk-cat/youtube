<script lang="ts">
  import type { Snippet } from 'svelte'

  const randomId = Math.random().toString(36).substring(2, 15)

  let {
    trigger,
    children
  }: {
    trigger?: Snippet<[{ popovertarget: string; style: string }]>
    children?: Snippet
  } = $props()
</script>

{@render trigger?.({ popovertarget: randomId, style: `anchor-name: --${randomId}` })}

<div popover id={randomId} style="position-anchor: --{randomId}" class="dropdown">
  {@render children?.()}
</div>

<style>
  .dropdown {
    position: absolute;
    position-area: top;
    background: transparent;
    position-try-fallbacks: flip-block;
  }
</style>
