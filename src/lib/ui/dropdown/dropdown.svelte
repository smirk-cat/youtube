<script lang="ts">
  import type { ComponentProps } from 'svelte'
  import BaseDropdown from './base-dropdown.svelte'

  let { trigger, children }: ComponentProps<typeof BaseDropdown> = $props()
</script>

<BaseDropdown {trigger}>
  <div class="flex rounded-xl bg-neutral-700 p-1">
    {@render children?.()}
  </div>
</BaseDropdown>
