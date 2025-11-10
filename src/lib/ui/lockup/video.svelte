<script lang="ts">
  import { cn } from '$lib/helpers'
  import { resolve } from '$app/paths'

  let {
    id,
    thumbnailUrl,
    title,
    meta,
    orientation
  }: {
    id: string
    thumbnailUrl: string
    title: string
    meta: {
      authorAvatarUrl?: string
      author: string
      views: string
      uploadedAt: string
    }
    orientation: 'vertical' | 'horizontal'
  } = $props()
</script>

<a
  href={resolve(`/watch/${id}`)}
  class={cn(
    'flex cursor-pointer gap-3',
    orientation == 'vertical' && 'flex-col',
    orientation == 'horizontal' && 'flex-row'
  )}
>
  <img
    src={thumbnailUrl}
    alt="Video Thumbnail"
    class={cn(
      'aspect-video rounded-xl object-cover',
      orientation == 'vertical' && 'w-full',
      orientation == 'horizontal' && 'h-24'
    )}
  />

  <div class="flex">
    {#if orientation == 'vertical' && meta.authorAvatarUrl}
      <img src={meta.authorAvatarUrl} alt={meta.author} class="mr-3 h-10 min-w-10 rounded-full" />
    {/if}

    <div class="flex flex-col">
      <span class={cn('line-clamp-2 text-ellipsis', orientation == 'horizontal' && 'text-sm')}>
        {title}
      </span>
      <span class="text-sm text-neutral-400">{meta.author}</span>
      <span class="text-sm text-neutral-400">{meta.views} • {meta.uploadedAt}</span>
    </div>
  </div>
</a>
