import { useState, useEffect } from "react";
import LogContainer from "../styled/LogContainer";
import LogArea from "./styled/LogArea";
import { subscribeToLogUpdates } from "../../utils/subscribe";
import { invoke } from "@tauri-apps/api";
import getNameFromPath from "../../utils/names";
import Title from "./styled/title";
import { File } from "../../context/AppContext";

const FileLog = ({ file }: { file: File }) => {
  const [log, setLog] = useState("");

  useEffect(() => {
    const unsub = subscribeToLogUpdates(file.id, (event) => {
      setLog((old) => old + event.payload + "\n");
    });

    return () => {
      invoke("unsubscribe", { threadName: file.id });
      unsub.then((u) => u());
    };
  }, []);

  return (
    <LogContainer>
      <Title>{getNameFromPath(file.path)}</Title>
      <LogArea readOnly value={log} />
    </LogContainer>
  );
};

export default FileLog;
