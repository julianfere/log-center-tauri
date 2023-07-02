import { AppBarButtonContainer, AppBarContainer, AppbarButton } from "./styled";
import { appWindow } from "@tauri-apps/api/window";

import CloseSvg from "../../assets/close_icon.svg";
import Minimize from "../../assets/minimize_window.svg";
import Maximize from "../../assets/maximize.svg";
import Icon from "../../assets/icon.svg";

const AppBar = () => {
  const handleClose = () => {
    appWindow.close();
  };

  const handleMinimize = () => {
    appWindow.minimize();
  };

  const handleMaximize = () => {
    appWindow.toggleMaximize();
  };

  return (
    <AppBarContainer data-tauri-drag-region>
      <div style={{ padding: "0.4rem 0 0 1rem" }}>
        <img src={Icon} alt="Icon" />
      </div>
      <AppBarButtonContainer>
        <AppbarButton onClick={handleMinimize}>
          <img src={Minimize} alt="Minimize" />
        </AppbarButton>
        <AppbarButton onClick={handleMaximize}>
          <img src={Maximize} alt="Maximize" />
        </AppbarButton>
        <AppbarButton isCloseButton onClick={handleClose}>
          <img src={CloseSvg} alt="Close" />
        </AppbarButton>
      </AppBarButtonContainer>
    </AppBarContainer>
  );
};

export default AppBar;
