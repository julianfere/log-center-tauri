import { useState, useEffect } from "react";
import LogContainer from "../styled/LogContainer";
import LogArea from "./styled/LogArea";
import { v4 } from "uuid";
import { subscribeToLogUpdates } from "../../utils/subscribe";
import { invoke } from "@tauri-apps/api";

const FileLog = () => {
  const [log, setLog] = useState("");

  useEffect(() => {
    const id = v4();

    const unsub = subscribeToLogUpdates(id, (event) => {
      console.log("updating", event.payload);
      setLog((old) => old + event.payload + "\n");
    });

    return () => {
      invoke("unsubscribe", { threadName: id });
      unsub.then((u) => u());
    };
  }, []);

  return (
    <LogContainer>
      <h1>FileLog</h1>
      <LogArea readOnly value={log} />
    </LogContainer>
  );
};

export default FileLog;
