<script lang="ts">
  import shaka from 'shaka-player/dist/shaka-player.ui.js'
  import 'shaka-player/dist/controls.css'
  import { onDestroy, onMount } from 'svelte'
  import { getInjectedProxyFunction, getProxyConfig } from '$lib/helpers'

  let {
    manifestUrl,
    isLive,
    toggleMode,
    startTime = 0
  }: {
    manifestUrl: string
    isLive: boolean
    toggleMode: () => void
    startTime?: number
  } = $props()

  let first = true
  let videoElement = $state<HTMLVideoElement | null>(null)
  let videoContainer = $state<HTMLDivElement | null>(null)

  let player: shaka.Player

  const init = async () => {
    if (!videoElement || !videoContainer) return

    shaka.polyfill.installAll()

    if (!shaka.Player.isBrowserSupported())
      throw new Error('Shaka Player is not supported on this browser.')

    player = new shaka.Player()
    player.configure({
      abr: { enabled: false }
    })

    const networkingEngine = player?.getNetworkingEngine()
    if (!networkingEngine) return

    networkingEngine.registerRequestFilter((_, request) => {
      let url = new URL(request.uris[0])

      if (
        (url.host.endsWith('.googlevideo.com') || url.href.includes('drm')) &&
        !getInjectedProxyFunction()
      ) {
        // eslint-disable-next-line svelte/prefer-svelte-reactivity
        const newUrl = new URL(url.toString())

        const { PROXY_HOST, PROXY_PORT, PROXY_PROTOCOL } = getProxyConfig()

        newUrl.searchParams.set('__headers', JSON.stringify(Object.entries(request.headers)))
        newUrl.searchParams.set('__host', url.host)
        newUrl.host = PROXY_HOST
        newUrl.port = PROXY_PORT.toString()
        newUrl.protocol = PROXY_PROTOCOL

        url = newUrl
      }

      request.uris[0] = url.toString()
    })

    await player.attach(videoElement)

    const ui = new shaka.ui.Overlay(player, videoContainer, videoElement)

    ui.configure({
      addBigPlayButton: false,
      overflowMenuButtons: [
        'captions',
        'quality',
        'language',
        'chapter',
        'picture_in_picture',
        'playback_rate',
        'loop',
        'recenter_vr',
        'toggle_stereoscopic',
        'save_video_frame'
      ],
      customContextMenu: true
    })

    const volumeContainer = videoContainer.getElementsByClassName('shaka-volume-bar-container')
    volumeContainer[0].addEventListener('mousewheel', (event) => {
      if (!(event instanceof WheelEvent)) return

      event.preventDefault()
      const delta = Math.sign(event.deltaY)
      videoElement!.volume = Math.max(0, Math.min(1, videoElement!.volume - delta * 0.05))
    })

    console.log('[Main] Shaka Player initialized')
  }

  async function loadVideo(manifestUrl: string) {
    if (!manifestUrl) {
      alert('Please enter a video ID.')
      return
    }

    console.log('[Player]', `Loading video: ${manifestUrl}`)

    try {
      await player.unload()

      if (isLive) {
        // alert('Live video playback is not yet implemented.')
        await player.load(manifestUrl)
      } else {
        const mpdBlob = new Blob([manifestUrl], { type: 'application/dash+xml' })
        const mpdUrl = URL.createObjectURL(mpdBlob)
        await player.load(mpdUrl)
      }

      nudge(startTime)
    } catch (e: unknown) {
      console.error('[Player]', 'Error:', e)
    }
  }

  onMount(() => {
    init().then(() => {
      loadVideo(manifestUrl)
      first = false
    })
  })

  onDestroy(() => {
    if (player) {
      player.destroy()
    }
  })

  $effect(() => {
    if (!first) {
      loadVideo(manifestUrl)
    }
  })

  $effect(() => {
    nudge(startTime)
  })

  const clamp = (v: number, min: number, max: number) => {
    return Math.min(max, Math.max(min, v))
  }

  const nudge = (seconds: number) => {
    const { start, end } = player.seekRange()
    const target = clamp(seconds, start, end)
    videoElement!.currentTime = target
  }

  const togglePlay = () => {
    if (videoElement!.paused) {
      videoElement!.play()
    } else {
      videoElement!.pause()
    }
  }

  const onKeyDown = (e: KeyboardEvent) => {
    const el = document.activeElement
    if (el && (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA')) return

    switch (e.code) {
      case 'Space':
        e.preventDefault()
        togglePlay()
        break
      case 'KeyM':
        e.preventDefault()
        videoElement!.muted = !videoElement!.muted
        break
      case 'ArrowRight':
        e.preventDefault()
        nudge(videoElement!.currentTime + 5)
        break
      case 'ArrowLeft':
        e.preventDefault()
        nudge(videoElement!.currentTime - 5)
        break
      case 'ArrowUp':
        e.preventDefault()
        videoElement!.volume = clamp(videoElement!.volume + 0.1, 0, 1)
        break
      case 'ArrowDown':
        e.preventDefault()
        videoElement!.volume = clamp(videoElement!.volume - 0.1, 0, 1)
        break
      case 'KeyF':
        e.preventDefault()
        if (document.fullscreenElement) document.exitFullscreen()
        else videoContainer!.requestFullscreen()
        break
      case 'KeyT':
        e.preventDefault()
        toggleMode()
        break
    }
  }
</script>

<svelte:window onkeydown={onKeyDown} />

<div bind:this={videoContainer} class="h-full">
  <video muted bind:this={videoElement} class="mx-auto" autoplay></video>
</div>

<style>
  :global(
    .shaka-controls-button-panel,
    .shaka-controls-top-button-panel,
    .shaka-scrim-container,
    .shaka-seek-bar-container,
    .shaka-statistics-container,
    .shaka-context-menu
  ) {
    transition: opacity cubic-bezier(0.4, 0, 0.6, 1) 150ms !important;
  }
</style>
