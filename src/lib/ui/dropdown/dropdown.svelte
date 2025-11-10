<script lang="ts">
  import type { ComponentProps } from 'svelte'
  import BaseDropdown from './base-dropdown.svelte'
  import { cn } from '$lib/helpers'

  type Props = ComponentProps<typeof BaseDropdown> & { class?: string }

  let { trigger, children, class: className }: Props = $props()
</script>

<BaseDropdown {trigger}>
  <div class={cn('flex flex-col rounded-xl bg-neutral-700 p-1', className)}>
    {@render children?.()}
  </div>
</BaseDropdown>
