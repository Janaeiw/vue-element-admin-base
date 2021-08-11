import { appName } from '@/settings'

export function getPageTitle(pageTitle) {
  if (pageTitle) {
    return `${pageTitle} - ${appName}`
  }
  return `${appName}`
}
