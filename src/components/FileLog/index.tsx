import { useState, useEffect } from "react";
import LogContainer from "../styled/LogContainer";
import LogArea, { CloseIcon, LogHeader, Title } from "./styled";
import { subscribeToLogUpdates } from "../../utils/subscribe";
import { invoke } from "@tauri-apps/api";
import getNameFromPath from "../../utils/names";
import { File, useAppContext } from "../../context/AppContext";

import Remove from "../../assets/remove.svg";

const FileLog = ({ file }: { file: File }) => {
  const { setFiles } = useAppContext();
  const [log, setLog] = useState("");

  const unsubscribe = (id: string, callback: Promise<() => void> | null) => {
    invoke("unsubscribe", { threadName: id }).then(() => {
      if (callback) callback.then((u) => u());
    });
  };

  const handleRemove = () => {
    unsubscribe(file.id, null);
    setFiles((old) => old.filter((f) => f.id !== file.id));
  };

  useEffect(() => {
    const unsub = subscribeToLogUpdates(file.id, (event) => {
      setLog((old) => old + event.payload + "\n");
    });

    return () => {
      unsubscribe(file.id, unsub);
    };
  }, []);

  return (
    <LogContainer>
      <LogHeader>
        <Title>{getNameFromPath(file.path)}</Title>
        <CloseIcon src={Remove} onClick={handleRemove} />
      </LogHeader>
      <LogArea readOnly value={log} />
    </LogContainer>
  );
};

export default FileLog;
