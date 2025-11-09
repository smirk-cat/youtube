<script lang="ts">
  import { Player } from '$lib/features/yt/player'
  import { Button, ButtonGroup } from '$lib/ui'
  import { BaseDropdown } from '$lib/ui/base'
  import { Lockup } from '$lib/ui'

  let { data } = $props()
  let startTime = $state(data.startTime)

  $effect(() => {
    startTime = data.startTime
  })

  let isLiked = $state(data.isLiked)
  let isDisliked = $state(data.isDisliked)

  const onDescriptionClick = (e: MouseEvent) => {
    const target = e.target as HTMLElement
    const parent = target.parentElement

    if (
      parent instanceof HTMLAnchorElement &&
      parent.href.startsWith('https://www.youtube.com/watch')
    ) {
      const url = new URL(parent.href)
      const t = url.searchParams.get('t')

      if (t) {
        const timeInSeconds = parseInt(t, 10) || 0
        startTime = timeInSeconds
      }

      e.preventDefault()
    }
  }
</script>

<div class="grid grid-cols-[1fr_24rem] gap-4">
  {#key data.id}
    <div class="flex w-full flex-col">
      <div
        class="mb-4 aspect-video overflow-hidden rounded-xl duration-300 starting:-translate-y-4 starting:opacity-0"
      >
        <Player manifestUrl={data.dashManifestUrl} isLive={data.isLive} {startTime} />
      </div>

      <div
        class="mb-2 text-lg font-bold delay-25 duration-300 starting:-translate-y-4 starting:opacity-0"
      >
        {data.title}
      </div>

      <div
        class="mb-4 flex items-center delay-50 duration-300 starting:-translate-y-4 starting:opacity-0"
      >
        <img src={data.channelAvatar} alt="Channel Avatar" class="mr-2 h-10 w-10 rounded-full" />

        <div class="flex flex-col">
          <span>{data.channelName}</span>
          <span class="text-sm text-neutral-400">{data.subscriberCount}</span>
        </div>

        <button
          class="ml-8 rounded-full bg-neutral-100 px-4 py-2 text-sm font-semibold text-neutral-900"
        >
          Subscribe
        </button>

        <ButtonGroup class="ml-auto">
          <Button
            icon={isLiked ? 'i-tabler-thumb-up-filled' : 'i-tabler-thumb-up'}
            onclick={() => {
              data.like()
              isLiked = !isLiked
              if (!isDisliked) data.removeRating()
              if (isLiked && isDisliked) isDisliked = false
            }}
          >
            {Intl.NumberFormat('en', { notation: 'compact' }).format(data.likes)}
          </Button>
          <Button
            icon={isDisliked ? 'i-tabler-thumb-down-filled' : 'i-tabler-thumb-down'}
            onclick={() => {
              data.dislike()
              isDisliked = !isDisliked
              if (!isDisliked) data.removeRating()
              if (isDisliked && isLiked) isLiked = false
            }}
          >
            {Intl.NumberFormat('en', { notation: 'compact' }).format(data.dislikes)}
          </Button>
        </ButtonGroup>

        <Button icon="i-tabler-share" class="ml-2">Share</Button>

        <BaseDropdown>
          {#snippet trigger(props)}
            <Button {...props} icon="i-tabler-dots" aria-label="More" class="ml-2" />
          {/snippet}

          Kafif
        </BaseDropdown>
      </div>

      <div
        class="rounded-xl bg-neutral-800 px-4 py-3 text-sm delay-75 duration-300 starting:-translate-y-4 starting:opacity-0"
      >
        <div class="mb-2 text-neutral-300">
          {data.viewCount} • {data.publishedDate}
        </div>

        <button
          onclick={onDescriptionClick}
          class="text-left [&>.yt-ch-link]:inline-flex [&>.yt-ch-link]:items-center [&>.yt-ch-link]:rounded-md [&>.yt-ch-link]:bg-neutral-700 [&>.yt-ch-link]:pl-1.5 [&>.yt-ch-link]:text-neutral-100 [&>.yt-ch-link>span]:-ml-1.5 [&>a]:text-blue-400"
        >
          {@html data.descriptionHtml}
        </button>
      </div>
    </div>
  {/key}

  <div class="flex flex-col gap-4">
    {#each data.relatedVideos as video, i (video.videoId + i + Math.random())}
      <Lockup
        type="video"
        id={video.videoId}
        thumbnailUrl={video.thumbnailUrl}
        title={video.title.toString()}
        meta={{
          author: video.author,
          views: video.views,
          uploadedAt: video.uploadedAt
        }}
        orientation="horizontal"
      />
    {/each}
  </div>
</div>
