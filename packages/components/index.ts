import CQIcon from "./icon";
import CQButton from "./button";

// TODO button组件有问题
export const coms = { CQIcon, CQButton };

const install = () => {
  Object.entries(coms).forEach((c) => {
    console.log("c---", c);
  });
};

install();

export default { install };
