<script lang="ts">
  import type { ComponentProps } from 'svelte'
  import Video from './video.svelte'

  type WithType<N extends string, T> = T & { type: N }

  type Props = WithType<'video', ComponentProps<typeof Video>>
  // | WithType<'playlist', PlaylistProps>
  // | WithType<'post', PostProps>

  let { type, ...rest }: Props = $props()

  const Component = $derived(
    {
      video: Video
      // playlist: Playlist,
      // post: Post
    }[type]
  )
</script>

<Component {...rest} />
