<script lang="ts">
  import { cn } from '$lib/helpers'

  interface Props {
    id: string
    thumbnailUrl: string
    title: string
    orientation: 'vertical' | 'horizontal'
  }

  let { id, thumbnailUrl, title, orientation }: Props = $props()
</script>

<a
  href="/watch/{id}"
  class={cn('flex cursor-pointer gap-2', {
    'flex-col': orientation == 'horizontal',
    'flex-row': orientation == 'vertical'
  })}
>
  <img
    src={thumbnailUrl}
    alt="Video Thumbnail"
    class={cn('aspect-video rounded-xl object-cover', {
      'w-full': orientation == 'horizontal',
      'h-24': orientation == 'vertical'
    })}
  />

  <div class="flex flex-row">
    {#if orientation == 'horizontal'}
      <!-- TODO img -->
      <div class="mr-2 h-10 w-10 shrink-0 rounded-full"></div>
    {/if}

    <div class="flex flex-col text-sm">
      <span class="line-clamp-2 text-ellipsis">{title}</span>
      <span class="text-sm text-neutral-400">metadata[0]</span>
      <span class="text-sm text-neutral-400">metadata[1]</span>
    </div>
  </div>
</a>
