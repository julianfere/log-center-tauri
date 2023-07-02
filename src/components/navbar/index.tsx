import NavContainer, { NavButton } from "./styled";
import { invoke } from "@tauri-apps/api";
import { useAppContext } from "../../context/AppContext";

const Navbar = ({ handler }: { handler: () => void }) => {
  const { isWatching, setIsWatching, files } = useAppContext();

  const handleWatching = async () => {
    if (!isWatching) {
      await invoke("subscribe", { paths: files });
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
      <h1>-</h1>
      <NavButton onClick={handleWatching} watching={isWatching}>
        {isWatching ? "Stop watching" : "Start watching"}
      </NavButton>
      <NavButton onClick={handler} disabled={isWatching}>
        Add log file
      </NavButton>
    </NavContainer>
  );
};

export default Navbar;
