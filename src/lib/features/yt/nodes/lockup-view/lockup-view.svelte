<script lang="ts">
  import type { YTNodes } from 'youtubei.js/web'
  import Unsupported from '../unsupported.svelte'
  import { UINode } from '..'

  let { node }: { node: YTNodes.LockupView } = $props()
</script>

{#if node.content_type === 'VIDEO'}
  <a href="watch/{node.content_id}" class="">
    <UINode node={node.content_image} />

    {#if node.metadata}
      {@html node.metadata.title.toHTML()}
    {/if}
  </a>
{:else}
  <Unsupported text={`Unsupported LockupView type: ${node.content_type}`} />
{/if}
