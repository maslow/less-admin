import defaultSettings from '@/settings'

const title = defaultSettings.title || 'Go Chess Admin'

export default function getPageTitle(pageTitle) {
  if (pageTitle) {
    return `${pageTitle} - ${title}`
  }
  return `${title}`
}
