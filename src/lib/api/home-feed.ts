import { yt, type InnerTubeHomeFeed } from '$lib/youtube'
import { YTNodes } from 'youtubei.js/web'

export interface HomeFeedFilter {
  text: string
  selected: boolean
}

export interface HomeFeedVideo {
  id: string
  title: string
  thumbnailUrl: string
}

export type HomeFeedItem = { type: 'video' } & HomeFeedVideo

const parseItem = (node: YTNodes.RichItem): HomeFeedItem | null => {
  if (node.content.is(YTNodes.LockupView)) {
    const lockup = node.content.as(YTNodes.LockupView)

    if (lockup.content_type === 'VIDEO') {
      return {
        type: 'video',
        id: lockup.content_id,
        title: lockup.metadata?.title.toString() || '',
        thumbnailUrl: lockup.content_image?.as(YTNodes.ThumbnailView).image?.[0]?.url || ''
      }
    }
  }

  return null
}

const parseGrid = (node: YTNodes.RichGrid) => {
  const items: HomeFeedItem[] = []

  for (const item of node.contents) {
    if (item.is(YTNodes.RichItem)) {
      const parsed = parseItem(item.as(YTNodes.RichItem))
      if (parsed) {
        items.push(parsed)
      }
    }
  }

  return items
}

const parseFeed = (feed: InnerTubeHomeFeed) => {
  if (feed.contents?.is(YTNodes.RichGrid)) {
    return parseGrid(feed.contents)
  }

  return []
}

export const createHomeFeed = () => {
  let feed: InnerTubeHomeFeed | null = null

  const feedItems: HomeFeedItem[] = []
  let feedFilters: HomeFeedFilter[] = []

  return {
    get items() {
      return feedItems
    },

    get filters() {
      return feedFilters
    },

    async next() {
      if (!feed) {
        feed = await yt.getHomeFeed()
      } else {
        feed = await feed.getContinuation()
      }

      feedItems.concat(parseFeed(feed))
      feedFilters = feed.filter_chips.map((x) => ({
        text: x.text,
        selected: x.is_selected
      }))
    }
  }
}
