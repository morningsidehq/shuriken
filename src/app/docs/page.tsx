import { Metadata } from 'next'
import { Card } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { promises as fs } from 'fs'
import path from 'path'
import type { Components } from 'react-markdown'

export const metadata: Metadata = {
  title: 'Documentation | Constance',
  description: 'Constance Application Documentation',
}

async function getDocumentation() {
  const filePath = path.join(
    process.cwd(),
    'src',
    'docs',
    'app-documentation.md',
  )
  try {
    const content = await fs.readFile(filePath, 'utf8')
    return content
  } catch (error) {
    console.error('Error reading documentation:', error)
    return '# Documentation\n\nError loading documentation content.'
  }
}

const markdownComponents: Partial<Components> = {
  h1: ({ node, ...props }) => (
    <h1
      className="mb-6 scroll-m-20 text-4xl font-bold tracking-tight"
      {...props}
    />
  ),
  h2: ({ node, ...props }) => (
    <h2
      className="mb-4 mt-10 scroll-m-20 text-2xl font-semibold tracking-tight"
      {...props}
    />
  ),
  h3: ({ node, ...props }) => (
    <h3
      className="mb-4 mt-8 scroll-m-20 text-xl font-semibold tracking-tight"
      {...props}
    />
  ),
  h4: ({ node, ...props }) => (
    <h4
      className="mb-2 mt-6 scroll-m-20 text-lg font-semibold tracking-tight"
      {...props}
    />
  ),
  p: ({ node, ...props }) => (
    <p
      className="mb-4 leading-7 text-muted-foreground [&:not(:first-child)]:mt-2"
      {...props}
    />
  ),
  ul: ({ node, ...props }) => (
    <ul
      className="my-4 ml-4 list-inside list-disc space-y-2 text-muted-foreground"
      {...props}
    />
  ),
  ol: ({ node, ...props }) => (
    <ol
      className="my-4 ml-4 list-inside list-decimal space-y-2 text-muted-foreground"
      {...props}
    />
  ),
  li: ({ node, ...props }) => <li className="leading-7" {...props} />,
  code: ({ node, className, ...props }) => (
    <code
      className={`relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm ${
        className || ''
      }`}
      {...props}
    />
  ),
  pre: ({ node, ...props }) => (
    <pre
      className="mb-4 mt-4 overflow-x-auto rounded-lg border bg-black py-4 dark:bg-zinc-900"
      {...props}
    />
  ),
  a: ({ node, ...props }) => (
    <a
      className="font-medium text-primary underline underline-offset-4 hover:text-primary/80"
      {...props}
    />
  ),
  blockquote: ({ node, ...props }) => (
    <blockquote className="mt-6 border-l-2 pl-6 italic" {...props} />
  ),
  hr: () => <hr className="my-4 border-zinc-200 dark:border-zinc-800" />,
}

export default async function DocsPage() {
  const content = await getDocumentation()

  return (
    <div className="container relative min-h-screen pb-16 pt-6">
      <div className="flex flex-col items-center justify-center">
        <Card className="w-full max-w-5xl p-8">
          <ScrollArea className="h-[calc(100vh-12rem)] pr-6">
            <Markdown
              remarkPlugins={[remarkGfm]}
              components={markdownComponents}
            >
              {content}
            </Markdown>
          </ScrollArea>
        </Card>
      </div>
    </div>
  )
}
