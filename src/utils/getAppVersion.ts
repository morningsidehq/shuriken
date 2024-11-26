import fs from 'fs/promises'
import path from 'path'

export async function getAppVersion(): Promise<string> {
  try {
    const docPath = path.join(
      process.cwd(),
      'src',
      'docs',
      'app-documentation.md',
    )
    const content = await fs.readFile(docPath, 'utf-8')

    // Extract version using regex
    const versionMatch = content.match(/Current Version: (v\d+\.\d+\.\d+)/)
    if (versionMatch && versionMatch[1]) {
      return versionMatch[1]
    }

    // Fallback version if not found
    return 'v0.4.6'
  } catch (error) {
    console.error('Error reading version:', error)
    return 'v0.4.6'
  }
}
