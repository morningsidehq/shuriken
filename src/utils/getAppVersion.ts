import fs from 'fs'
import path from 'path'

export function getAppVersion(): string {
  try {
    const docPath = path.join(
      process.cwd(),
      'src',
      'docs',
      'app-documentation.md',
    )
    const content = fs.readFileSync(docPath, 'utf8')
    const versionMatch = content.match(/Current Version: (v\d+\.\d+\.\d+)/)
    return versionMatch ? versionMatch[1] : 'v0.0.0'
  } catch (error) {
    console.error('Error reading version:', error)
    return 'v0.0.0'
  }
}
