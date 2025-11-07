<script lang="ts">
  import type { YTNodes } from 'youtubei.js/web'
  import Unsupported from '../unsupported.svelte'
  import { UINode } from '..'

  let { node }: { node: YTNodes.ShortsLockupView } = $props()

  let img = $derived(node.thumbnail[0])
</script>

<a href="watch/{node.entity_id}" class="">
  <img src={img.url} width={img.width} height={img.height} alt="Shorts Thumbnail" />
</a>
