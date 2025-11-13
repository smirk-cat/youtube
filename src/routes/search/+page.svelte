<script lang="ts">
  import { SearchFeed } from '$lib/features/yt/search'

  let { data } = $props()
</script>

<SearchFeed query={data.query} />
