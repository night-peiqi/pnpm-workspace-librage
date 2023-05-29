import type { App } from "vue";
import CQIcon from "./icon";
import CQButton from "./button";

export const coms = { CQIcon, CQButton };

const install = (app: App) => {
  Object.entries(coms).forEach(([name, component]) => {
    app.component(name, component);
  });
};

export default { install };
