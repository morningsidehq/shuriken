import { readFileSync } from 'fs'
import path from 'path'

export async function getAppVersion(): Promise<string> {
  try {
    const docPath = path.join(
      process.cwd(),
      'src',
      'docs',
      'app-documentation.md',
    )
    const content = readFileSync(docPath, 'utf8')
    const versionMatch = content.match(/Current Version: (v[\d.]+)/)
    return versionMatch ? versionMatch[1] : 'Version unknown'
  } catch (error) {
    console.error('Error reading version:', error)
    return 'Version unknown'
  }
}
