<script lang="ts">
  import { type ComponentProps } from 'svelte'
  import { YTNodes } from 'youtubei.js/web'
  import { yt, type InnerTubeSearch } from '$lib/youtube'
  import { Lockup } from '$lib/ui'
  import { getRealNames } from '$lib/helpers'

  let { query }: { query: string } = $props()

  type SearchFeedItem = { animIndex: number } & ComponentProps<typeof Lockup>

  let items = $state<SearchFeedItem[]>([])

  let feed: InnerTubeSearch | null = null
  let tmpItems: SearchFeedItem[] = []

  const parseVideo = (node: YTNodes.Video) => {
    tmpItems.push({
      type: 'video',
      id: node.video_id,
      thumbnailUrl: node.thumbnails[0]?.url || '',
      title: node.untranslated_title?.toString() ?? node.title.toString(),
      meta: {
        authorAvatarUrl: node.author?.thumbnails?.[0]?.url || '',
        author: node.author.name,
        views: node.view_count?.toString() || '',
        uploadedAt: node.published?.toString() || ''
      },
      orientation: 'horizontal',
      animIndex: 0
    })
  }

  const parseFeed = (contents: InnerTubeSearch['results']) => {
    for (const item of contents) {
      if (item.is(YTNodes.Video)) {
        parseVideo(item.as(YTNodes.Video))
      }
    }
  }

  const loadItems = async () => {
    console.log(feed?.results)

    if (feed?.results) {
      tmpItems = []
      parseFeed(feed.results)
      tmpItems.forEach((item, index) => {
        item.animIndex = index
      })

      const realNames = await getRealNames(tmpItems.filter((i) => i.type === 'video'))
      for (const item of realNames) {
        const it = tmpItems.find((i) => i.id === item.id)
        if (it) {
          it.title = item.title
        }
      }

      items = [...items, ...tmpItems]
    }
  }

  const next = async () => {
    if (feed && !feed.has_continuation) {
      return
    } else if (feed) {
      feed = await feed.getContinuation()
    } else {
      feed = await yt.search(query)
    }

    await loadItems()
  }

  $effect(() => {
    feed = null
    items = []
    next()
  })
</script>

<div class="container mx-auto flex flex-col gap-4">
  {#each items as item (item.id)}
    {@const { animIndex, ...props } = item}
    <div
      style="--delay: {animIndex * 10}ms"
      class="delay-(--delay) duration-300 starting:-translate-y-4 starting:opacity-0"
    >
      <Lockup {...props} />
    </div>
  {:else}
    <div class="flex h-64 col-span-full w-full items-center justify-center">
      <div class="h-16 w-16 animate-spin text-red-400 i-tabler-loader-2"></div>
    </div>
  {/each}
</div>
