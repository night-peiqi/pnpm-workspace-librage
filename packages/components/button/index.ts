import { withInstall } from "@cq/utils/withInstall";
import Button from "./src/button.vue";

const CQButton = withInstall<typeof Button>(Button);

export { CQButton };

export default CQButton;
