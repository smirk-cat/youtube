<script lang="ts">
  import { cn } from '$lib/helpers'
  import type { HTMLAttributes } from 'svelte/elements'

  type Props = HTMLAttributes<HTMLButtonElement> & {
    icon?: string
  }

  let { children, icon, class: className, ...rest }: Props = $props()

  const iconOnly = $derived(icon && !children)
</script>

<button
  {...rest}
  class={cn(
    'relative flex items-center rounded-full bg-neutral-800 py-2 text-sm font-semibold hover:bg-neutral-700',
    iconOnly ? 'px-2' : 'px-4',
    className
  )}
>
  {#if icon}
    <i class={cn(icon, !iconOnly && 'mr-2 -ml-1.5 text-neutral-300', 'h-5 w-5')}></i>
  {/if}

  {@render children?.()}
</button>
