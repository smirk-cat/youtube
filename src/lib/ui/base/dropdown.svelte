<script lang="ts">
  import type { Snippet } from 'svelte'

  const randomId = Math.random().toString(36).substring(2, 15)

  let {
    trigger,
    children
  }: {
    trigger?: Snippet<[{ popovertarget: string }]>
    children?: Snippet
  } = $props()
</script>

{@render trigger?.({ popovertarget: randomId })}

<div popover id={randomId}>
  {@render children?.()}
</div>
