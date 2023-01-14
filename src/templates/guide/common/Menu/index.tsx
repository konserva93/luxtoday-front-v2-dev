import Link from 'next/link'
import s from './menu.module.scss'

type Link = { href: string, title: string }

interface MenuProps {
  links: Link[]
}

const Menu = ({ links }: MenuProps) => (
  <ul className={s.list}>
    {links.map(({ href, title }, i) => (
      <li key={i}>
        <Link href={href}>
          {title}
        </Link>
      </li>
    ))}
  </ul>
)

export default Menu