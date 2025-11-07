<script lang="ts">
  import type { YTNodes } from 'youtubei.js/web'
  import { UINode } from '..'

  let { node }: { node: YTNodes.RichShelf } = $props()
</script>

<div class="flex flex-col">
  <p>{@html node.title.toHTML()}</p>

  <div class="flex">
    {#each node.contents as child}
      <UINode node={child} />
    {/each}
  </div>
</div>
