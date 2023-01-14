import Gallery, { GalleryProps } from '@/components/Gallery'
import withStyles from '@/utils/decorators/withStyles'
import styles from './gallery.module.scss'

export default withStyles<GalleryProps>(Gallery, styles)
