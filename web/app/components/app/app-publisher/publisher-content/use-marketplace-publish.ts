import { useState } from 'react'
import { publishToCreatorsPlatform } from '@/service/apps'

export function useMarketplacePublish(appId?: string) {
  const [isPublishing, setIsPublishing] = useState(false)

  async function publish() {
    if (!appId || isPublishing) return

    setIsPublishing(true)
    try {
      const response = await publishToCreatorsPlatform({ appID: appId })
      if (response.redirect_url) window.open(response.redirect_url, '_blank')
    } catch {
      // The request layer reports this failure. Keep the current UI state.
    } finally {
      setIsPublishing(false)
    }
  }

  return {
    isPublishing,
    publish,
  }
}
