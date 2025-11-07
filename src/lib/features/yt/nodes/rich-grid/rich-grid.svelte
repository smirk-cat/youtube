<script lang="ts">
  import { YTNodes } from 'youtubei.js/web'
  import { UINode } from '..'
  import { yt, type YTNode } from '$lib/youtube'

  let { node }: { node: YTNodes.RichGrid } = $props()

  let content = $state<YTNode[]>([])

  const COLS = 3

  $effect(() => {
    const items: YTNode[] = node.contents.filter(
      (x) => !x.is(YTNodes.RichSection) && (x.is(YTNodes.RichItem) ? x.content !== null : true)
    )
    const others = node.contents.filter((x) => x.is(YTNodes.RichSection))

    others.forEach((sec, i) => {
      const index = (i + 1) * COLS + i // account for previously inserted sections
      if (index <= items.length) {
        items.splice(index, 0, sec)
      } else {
        items.push(sec)
      }
    })

    content = items
  })
</script>

<UINode node={node.header} />
<div style="--cols: {COLS}" class="grid grid-cols-[repeat(var(--cols),minmax(0,1fr))] gap-8">
  {#each content as child}
    <UINode node={child} />
  {/each}
</div>
