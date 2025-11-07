<script lang="ts">
  import type { YTNodes } from 'youtubei.js/web'
  import { UINode } from '..'

  let { node }: { node: YTNodes.ThumbnailView } = $props()

  let img = $derived(node.image[0])
</script>

<div>
  <img src={img.url} alt={img.url} width={img.width} height={img.height} />
</div>
