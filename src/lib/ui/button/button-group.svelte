<script lang="ts">
  import { cn } from '$lib/helpers'
  import type { HTMLAttributes } from 'svelte/elements'

  type Props = HTMLAttributes<HTMLDivElement> & {
    icon?: string
  }

  let { children, class: className, ...rest }: Props = $props()
</script>

<div
  {...rest}
  class={cn(
    'flex space-x-px rounded-full bg-neutral-800 *:rounded-none *:not-first:before:absolute *:not-first:before:-left-px *:not-first:before:h-6 *:not-first:before:w-px *:not-first:before:bg-neutral-700 *:first:rounded-l-full *:last:rounded-r-full',
    className
  )}
>
  {@render children?.()}
</div>
