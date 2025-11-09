<script lang="ts">
  import { onMount } from 'svelte'
  import { yt, type InnerTubeHomeFeed } from '$lib/youtube'
  import { YTNodes } from 'youtubei.js/web'

  interface HomeFeedFilter {
    text: string
    selected: boolean
  }

  interface HomeFeedVideo {
    id: string
    title: string
    thumbnailUrl: string
    animIndex: number
  }

  type HomeFeedItem = { type: 'video' } & HomeFeedVideo

  let items = $state<HomeFeedItem[]>([])
  let filters = $state<HomeFeedFilter[]>([])

  let feed: InnerTubeHomeFeed | null = null
  let tmpItems: HomeFeedItem[] = []
  let continuationRef: HTMLDivElement

  const parseItem = (node: YTNodes.RichItem) => {
    if (node.content?.is(YTNodes.LockupView)) {
      const lockup = node.content.as(YTNodes.LockupView)

      if (lockup.content_type === 'VIDEO') {
        tmpItems.push({
          type: 'video',
          id: lockup.content_id,
          title: lockup.metadata?.title.toString() || '',
          thumbnailUrl: lockup.content_image?.as(YTNodes.ThumbnailView).image?.[0]?.url || '',
          animIndex: 0
        })
      }
    }
  }

  const parseFeed = (contents: YTNodes.RichGrid['contents']) => {
    for (const item of contents) {
      if (item.is(YTNodes.RichItem)) {
        parseItem(item.as(YTNodes.RichItem))
      }
    }
  }

  const loadItems = () => {
    console.log(feed?.contents)

    if (
      feed?.contents?.is(YTNodes.RichGrid) ||
      feed?.contents?.is(YTNodes.AppendContinuationItemsAction)
    ) {
      tmpItems = []
      parseFeed(feed.contents.contents)
      tmpItems.forEach((item, index) => {
        item.animIndex = index
      })
      items = [...items, ...tmpItems]
    }

    if (filters.length === 0) {
      filters = feed
        ? feed.filter_chips.map((x) => ({
            text: x.text,
            selected: x.is_selected
          }))
        : []
    }
  }

  const next = async () => {
    if (feed && !feed.has_continuation) {
      return
    } else if (feed) {
      feed = await feed.getContinuation()
    } else {
      feed = await yt.getHomeFeed()
    }

    loadItems()
  }

  onMount(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0]
        if (first.isIntersecting) {
          next()
        }
      },
      { threshold: 1 }
    )
    observer.observe(continuationRef)

    return () => {
      observer.disconnect()
    }
  })
</script>

<div class="scroll-hidden -mx-8 mb-4 flex gap-2 overflow-x-auto px-8">
  {#each filters as filter}
    <!-- TODO: filters are broken in yti -->
    <button
      class="rounded-xl px-4 py-2 text-sm font-semibold whitespace-nowrap transition-colors duration-200 {filter.selected
        ? 'bg-neutral-700 text-white'
        : 'bg-neutral-800 text-neutral-400 hover:bg-neutral-700 hover:text-white'}"
    >
      {filter.text}
    </button>
  {/each}
</div>

<div class="grid grid-cols-4 gap-4">
  {#each items as item}
    <a
      href={`/watch/${item.id}`}
      style="--delay: {item.animIndex * 25}ms"
      class="flex flex-col delay-(--delay) duration-300 starting:-translate-y-4 starting:opacity-0"
    >
      <div class="mb-2 aspect-video w-full overflow-hidden rounded-xl">
        <img
          src={item.thumbnailUrl}
          alt="Video Thumbnail"
          class="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
        />
      </div>

      <div class="text-sm leading-tight font-semibold">{item.title}</div>
      <!-- <div class="mt-1 text-xs text-neutral-500">{video.channelName}</div> -->
    </a>
  {:else}
    <div class="flex h-64 col-span-full w-full items-center justify-center">
      <div class="h-16 w-16 animate-spin text-red-400 i-tabler-loader-2"></div>
    </div>
  {/each}

  <div bind:this={continuationRef}></div>
</div>
