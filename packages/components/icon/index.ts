import { withInstall } from "@cq/utils";
import Icon from "./src/icon.vue";

const CQIcon = withInstall<typeof Icon>(Icon);

export { CQIcon };

export default CQIcon;
