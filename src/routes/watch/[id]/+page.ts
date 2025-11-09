import { yt } from '$lib/youtube'
import { YTNodes } from 'youtubei.js'
import type { PageLoad } from './$types'

export const load: PageLoad = async ({ params, fetch, url }) => {
  const video = await yt.getInfo(params.id, { client: 'WEB_EMBEDDED' })

  const rydResponse = await fetch('https://returnyoutubedislikeapi.com/votes?videoId=' + params.id)
  const rydData = await rydResponse.json().catch(() => null)

  const likes = rydData?.likes ?? 'Hidden'
  const dislikes = rydData?.dislikes ?? 'Hidden'

  const startTimeStr = url.searchParams.get('t') ?? '0'
  const startTime = parseInt(startTimeStr) || 0

  const isLive = video.basic_info.is_live || false

  let dashManifestUrl = ''
  if (isLive) {
    dashManifestUrl =
      video.streaming_data?.hls_manifest_url || video.streaming_data?.dash_manifest_url || ''
  } else {
    dashManifestUrl = await video.toDash({
      // format_filter: (format) => !format.mime_type.includes('audio/')
    })
  }

  return {
    id: params.id,
    title: video.primary_info?.title || '',
    descriptionHtml: video.secondary_info?.description.toHTML() || '',
    channelName: video.secondary_info?.owner?.author.name || '',
    channelAvatar: video.secondary_info?.owner?.author.best_thumbnail?.url || '',
    subscriberCount: video.secondary_info?.owner?.subscriber_count || '',
    relatedVideos: video.watch_next_feed
      ?.filter((x) => x.is(YTNodes.LockupView) && x.content_type === 'VIDEO')
      .map((x) => x.as(YTNodes.LockupView))
      .map((x) => ({
        videoId: x.content_id || '',
        title: x.metadata?.title || '',
        // @ts-expect-error: fuck
        thumbnailUrl: x.content_image?.image?.[0]?.url || '',
        author: x.metadata?.metadata?.metadata_rows?.[0].metadata_parts?.[0].text?.toString() || '',
        views: x.metadata?.metadata?.metadata_rows?.[1].metadata_parts?.[0].text?.toString() || '',
        uploadedAt:
          x.metadata?.metadata?.metadata_rows?.[1].metadata_parts?.[1].text?.toString() || ''
      })),
    viewCount: video.primary_info?.view_count?.short_view_count || '',
    publishedDate: video.primary_info?.published || '',
    likes,
    dislikes,
    startTime,
    dashManifestUrl,
    isLive,
    isLiked: video.basic_info.is_liked,
    isDisliked: video.basic_info.is_disliked,
    like: () => {
      video.like()
    },
    dislike: () => {
      video.dislike()
    },
    removeRating: () => {
      video.removeRating()
    }
  }
}
