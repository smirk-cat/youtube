<script lang="ts">
  import type { YTNodes } from 'youtubei.js/web'
  import { UINode } from '..'

  let { node }: { node: YTNodes.RichSection } = $props()
</script>

<div class="col-span-full font-mono text-xs whitespace-pre">
  <UINode node={node.content} />
</div>
