import type { ReactNode } from 'react'

/**
 * Minimal renderer for Payload's Lexical rich-text value. Handles the common
 * cases used by form intro / confirmation content: paragraphs, headings, line
 * breaks and plain text nodes. Unknown node types fall back to a paragraph.
 */

interface LexicalTextNode {
  type: 'text'
  text?: string
}

interface LexicalElementNode {
  type: string
  tag?: string
  children?: LexicalNode[]
}

type LexicalNode = LexicalTextNode | LexicalElementNode

interface LexicalRoot {
  root?: { children?: LexicalNode[] }
}

const isTextNode = (node: LexicalNode): node is LexicalTextNode => node.type === 'text'

const renderNode = (node: LexicalNode, key: number): ReactNode => {
  if (isTextNode(node)) {
    return node.text ?? ''
  }

  if (node.type === 'linebreak') {
    return <br key={key} />
  }

  const children = node.children?.map((child, i) => renderNode(child, i))

  if (node.type === 'heading') {
    const headingTags = ['h1', 'h2', 'h3', 'h4'] as const
    const Tag = headingTags.find((tag) => tag === node.tag) ?? 'h3'
    return <Tag key={key}>{children}</Tag>
  }

  return <p key={key}>{children}</p>
}

/** Renders a Lexical value as React, or `null` when empty. */
export const RichText = ({ content }: { content: LexicalRoot | null | undefined }): ReactNode => {
  const children = content?.root?.children
  if (!children || children.length === 0) {
    return null
  }
  return <>{children.map((node, i) => renderNode(node, i))}</>
}
