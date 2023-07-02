import NavContainer, { ButtonContainer, NavButton } from "./styled";
import { invoke } from "@tauri-apps/api";
import { useAppContext } from "../../context/AppContext";

import WatchIcon from "../../assets/watch.svg";
import NoWatch from "../../assets/no_watch.svg";
import File from "../../assets/file.svg";

const Navbar = ({ handler }: { handler: () => void }) => {
  const { isWatching, setIsWatching, files } = useAppContext();

  const handleWatching = async () => {
    if (!isWatching) {
      await invoke("subscribe", { files });
    } else {
      console.log("stop watching");
      Promise.allSettled(
        files.map((file) => invoke("unsubscribe", { threadName: file.id }))
      );
    }

    setIsWatching(!isWatching);
  };

  return (
    <NavContainer>
      <NavButton onClick={handleWatching} watching={isWatching}>
        {isWatching ? (
          <ButtonContainer>
            <img src={NoWatch} alt="NoWatch" />
            <p>Stop watching</p>
          </ButtonContainer>
        ) : (
          <ButtonContainer>
            <img src={WatchIcon} alt="Watch" />
            <p>Watch</p>
          </ButtonContainer>
        )}
      </NavButton>
      <NavButton onClick={handler} disabled={isWatching}>
        <ButtonContainer>
          <img src={File} alt="Watch" />
          <p>Add log file</p>
        </ButtonContainer>
      </NavButton>
    </NavContainer>
  );
};

export default Navbar;
