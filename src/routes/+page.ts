import { yt } from '$lib/youtube'
import { YTNodes } from 'youtubei.js'
import type { PageLoad } from './$types'

export const load: PageLoad = async () => {
  const feed = await yt.getHomeFeed()

  const contents = feed.contents?.as(YTNodes.RichGrid).contents

  console.log(contents)

  return {
    videos: contents
      ?.filter(
        (x) =>
          x.is(YTNodes.RichItem) &&
          x.content?.is(YTNodes.LockupView) &&
          x.content.content_type === 'VIDEO'
      )
      .map((x) => x.as(YTNodes.RichItem).content.as(YTNodes.LockupView))
      .map((x) => ({
        videoId: x.content_id || '',
        title: x.metadata?.title || '',
        thumbnail: x.content_image?.as(YTNodes.ThumbnailView).image?.[0]?.url || ''
      }))
  }
}
