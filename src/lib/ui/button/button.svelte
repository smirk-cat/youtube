<script lang="ts">
  import { cn } from '$lib/helpers'
  import type { ComponentProps } from 'svelte'
  import BaseButton from './base-button.svelte'

  let {
    class: className,
    variant = '800',
    ...rest
  }: { variant?: '800' | '700' | '100' } & ComponentProps<typeof BaseButton> = $props()
</script>

<BaseButton
  {...rest}
  class={cn(
    'rounded-full',
    variant === '800' && 'bg-neutral-800 hover:bg-neutral-700',
    variant === '700' && 'bg-neutral-700 hover:bg-neutral-600',
    variant === '100' && 'bg-neutral-100 text-neutral-900 hover:bg-neutral-200',
    className
  )}
/>
