import { yt } from '$lib/youtube'
import { YTNodes } from 'youtubei.js'
import type { LayoutLoad } from './$types'

export const ssr = false

export const load: LayoutLoad = async () => {
  if (!yt.session.logged_in) {
    return {}
  }

  const info = await yt.account.getInfo()
  const user = info.contents?.as(YTNodes.AccountItemSection).contents[0].as(YTNodes.AccountItem)

  return {
    user: {
      avatarUrl: user?.account_photo[0].url || '',
      name: user?.account_name.toString() || '',
      channelId: user?.channel_handle.toString() || ''
    }
  }
}
