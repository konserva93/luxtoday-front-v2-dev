import Tooltip, { TooltipProps } from '@/components/Tooltip'
import withStyles from '@/utils/decorators/withStyles'
import styles from './tooltip.module.scss'

export default withStyles<TooltipProps>(Tooltip, styles)
