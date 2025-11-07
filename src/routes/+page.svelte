<script lang="ts">
  let { data } = $props()
</script>

<div class="grid grid-cols-3 gap-4">
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
      <!-- <div class="mt-1 text-xs text-neutral-500">{video.channelName}</div> -->
    </a>
  {/each}
</div>
