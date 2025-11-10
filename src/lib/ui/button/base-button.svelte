<script lang="ts">
  import { cn } from '$lib/helpers'
  import type { HTMLButtonAttributes } from 'svelte/elements'

  interface CustomProps {
    icon?: string
  }

  type Props = CustomProps & HTMLButtonAttributes & { href?: string }

  let { children, icon, class: className, ...rest }: Props = $props()

  const iconOnly = $derived(icon && !children)
  const Tag = $derived('href' in rest ? 'a' : 'button')
</script>

<svelte:element
  this={Tag}
  {...rest}
  class={cn(
    'relative flex cursor-pointer items-center py-2 text-sm font-semibold',
    iconOnly ? 'px-2' : 'px-4',
    className
  )}
>
  {#if icon}
    <i class={cn(icon, !iconOnly && 'mr-2 -ml-1.5 text-neutral-300', 'h-5 w-5')}></i>
  {/if}

  {@render children?.()}
</svelte:element>
