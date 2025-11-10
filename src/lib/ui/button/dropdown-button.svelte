<script lang="ts">
  import { cn } from '$lib/helpers'
  import type { ComponentProps } from 'svelte'
  import Button from './button.svelte'

  let { class: className, ...rest }: Omit<ComponentProps<typeof Button>, 'variant'> = $props()
</script>

<Button
  {...rest}
  variant="700"
  class={cn('rounded-lg bg-neutral-700 hover:bg-neutral-600', className)}
/>
