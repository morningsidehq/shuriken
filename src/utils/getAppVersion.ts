const APP_VERSION = 'v0.6.6'

export async function getAppVersion(): Promise<string> {
  try {
    return APP_VERSION
  } catch (error) {
    console.error('Error getting version:', error)
    return 'Version unknown'
  }
}
