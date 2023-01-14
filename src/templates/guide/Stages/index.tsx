import { Fragment, useState, useEffect } from 'react'
import { useTranslation } from 'next-i18next'
import { useRouter } from 'next/router'
import { useStages } from '@/api/guide'
import { scrollTo } from '@/utils/helpers'
import Stage from '../Stage'
import { wrapper } from '../Stage/stage.module.scss'
import s from './stages.module.scss'

const Stages = () => {
  const stages = useStages()
  const router = useRouter()
  const { t } = useTranslation()
  const { stage } = router.query as { stage?: string }
  const defaultActive = typeof stage === 'string' ? [stage] : []
  const [active, setActive] = useState<string[]>(defaultActive)

  const scrollToStage = (id: string) => {
    const index = stages.findIndex(({ slug }) => slug === id)
    const height = index === 0 ? 0 : Array.from(document.getElementsByClassName(wrapper)).slice(0, index).reduce(
      (acc, el) => acc + el.scrollHeight + 25,
      100
    )
    if (index > -1) {
      scrollTo(height)
    }
  }

  useEffect(() => {
    if (!stage) return
    setActive(defaultActive)
    scrollToStage(stage)
  }, [stage])

  const groupVariants = ['before', 'after', 'long'] as const

  const handleClick = (id: string) => {
    setActive(active.includes(id) ? active.filter((n) => n !== id) : [...active, id])
  }

  return (
    <Fragment>
      {stages.map((stage, i) => (
        <div className={s.item} key={stage.slug}>
          <Stage
            {...stage}
            variant={groupVariants[i]}
            subtitle={t(`stages.${i}`)}
            isActive={active.includes(stage.slug)}
            clickHandler={handleClick.bind(null, stage.slug)}
          />
        </div>
      ))}
    </Fragment>
  )
}

export default Stages
