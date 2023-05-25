import CQIcon from "./icon";
import CQButton from "./button";

// console.log("dirs", dirs);

export const coms = { CQIcon, CQButton };

const install = () => {
  Object.entries(coms).forEach((c) => {
    console.log("c---", c);
  });
};

install();

export default { install };
