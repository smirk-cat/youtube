<script lang="ts">
  import type { YTNode } from '$lib/youtube'
  import { YTNodes } from 'youtubei.js'
  import {
    RichGrid,
    RichItem,
    RichSection,
    LockupView,
    Unsupported,
    ThumbnailView,
    RichShelf,
    ShortsLockupView
  } from '.'

  let { node }: { node?: YTNode | null } = $props()
</script>

{#if node.is(YTNodes.RichGrid)}
  <RichGrid {node} />
{:else if node.is(YTNodes.RichItem)}
  <RichItem {node} />
{:else if node.is(YTNodes.RichSection)}
  <RichSection {node} />
{:else if node.is(YTNodes.RichShelf)}
  <RichShelf {node} />
{:else if node.is(YTNodes.ShortsLockupView)}
  <ShortsLockupView {node} />
{:else if node.is(YTNodes.LockupView)}
  <LockupView {node} />
{:else if node.is(YTNodes.ThumbnailView)}
  <ThumbnailView {node} />
{:else}
  <Unsupported text={`Unsupported YTNode type: ${node?.type}`} />
{/if}
