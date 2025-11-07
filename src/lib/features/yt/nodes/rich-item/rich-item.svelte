<script lang="ts">
  import type { YTNodes } from 'youtubei.js/web'
  import { UINode } from '..'

  let { node }: { node: YTNodes.RichItem } = $props()
</script>

{#if node.content}
  <UINode node={node.content} />
{:else}
  <div>NULL</div>
{/if}
