import { scrollTo } from '@/utils/helpers'
import { toPlainText } from '@portabletext/react'
import { useTranslation } from 'next-i18next'
import s from './tableOfContents.module.scss'

interface Heading {
  title: string
  id: string
  subheadings: Heading[]
}

interface Node {
  children: Node[]
  style: string
  _key: string
  _type: string
}

const filter = (ast: Node[], match: (node: Node) => boolean) =>
  ast.reduce<Node[]>((acc, node) => {
    if (match(node)) acc.push(node)
    if (node.children) acc.push(...filter(node.children, match))
    return acc
  }, [])

const findHeadings = (ast: Node[]) => filter(ast, (node) => /h\d/.test(node.style))

const parseContent = (ast: Node[]) => {
  const result: Heading[] = []
  const headings = findHeadings(ast)
  const path: number[] = []
  let lastLevel = 0

  headings.forEach((heading) => {
    const level = Number(heading.style.slice(1))

    if (level < lastLevel) for (let i = lastLevel; i >= level; i--) path.pop()
    else if (level === lastLevel) path.pop()

    const current = path.reduce((prev, curr) => prev[curr].subheadings, result)

    current.push({
      id: heading._key,
      title: toPlainText(heading),
      subheadings: [],
    })

    path.push(current.length - 1)
    lastLevel = level
  })

  return result
}

interface ListProps {
  headings: Heading[]
  Component: 'ul' | 'ol'
}

const List = ({ headings, Component }: ListProps) => {
  if(!headings.length) return null
  const handleClick = (id: string, e: React.SyntheticEvent) => {
    e.preventDefault();
    scrollTo(`#id${id}`)
  }
  return (
    <Component>
      {headings.map(({ title, id, subheadings }) => (
        <li key={id}>
          <a href={`#id${id}`} onClick={handleClick.bind(null, id)}>{title}</a>
          <List headings={subheadings} Component="ul" />
        </li>
      ))}
    </Component>
  )
}

const TableOfContents = ({ content }: { content: Node[] }) => {
  const { t } = useTranslation()
  const headings = parseContent(content)
  if(!headings.length) return null
  return (
    <div className={s.wrapper}>
      <div className={s.title}>{t('tableOfContents')}</div>
      <List headings={headings} Component="ol" />
    </div>
  )
}

export default TableOfContents
