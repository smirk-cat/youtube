<script lang="ts">
  import { UINode } from '$lib/features/yt/nodes'
  import { yt } from '$lib/youtube'
  import { onMount } from 'svelte'
  import { YTNodes } from 'youtubei.js'

  let node = $state<YTNodes.RichGrid | undefined>(undefined)

  onMount(async () => {
    const feed = await yt.getHomeFeed()
    node = feed.contents?.as(YTNodes.RichGrid)
  })
</script>

{#if node}
  <UINode {node} />
{:else}
  <div>Loading...</div>
{/if}

<!-- <div class="grid grid-cols-3 gap-4">
  {#each data.videos as video, i}
    <a
      href={`/watch/${video.videoId}`}
      style="--delay: {i * 25}ms"
      class="flex flex-col delay-(--delay) duration-300 starting:-translate-y-4 starting:opacity-0"
    >
      <div class="mb-2 aspect-video w-full overflow-hidden rounded-xl">
        <img
          src={video.thumbnail}
          alt="Video Thumbnail"
          class="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
        />
      </div>

      <div class="text-sm leading-tight font-semibold">{video.title}</div>
    </a>
  {/each}
</div> -->
