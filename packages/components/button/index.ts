import { withInstall } from '@cq/utils/withInstall'
import Button from './button.vue'


const CQButton = withInstall<typeof Button>(Button)

export default CQButton