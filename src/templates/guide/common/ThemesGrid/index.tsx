import { GuideTheme } from '@/api/guide'
import { grid } from '@/themes/default'
import ThemeLink from '../ThemeLink'

interface ThemeGridProps {
  list: GuideTheme[]
  stageSlug: string,
}

const ThemesGrid = ({ list, stageSlug }: ThemeGridProps) => {
  return (
    <div className={grid.themes}>
      {list.map(theme => <ThemeLink stageSlug={stageSlug} key={theme.slug} {...theme} />)}
    </div>
  )
}

export default ThemesGrid
