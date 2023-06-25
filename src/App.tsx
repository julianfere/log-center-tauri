import { useEffect, useState } from "react";
import { listen } from "@tauri-apps/api/event";
import { invoke } from "@tauri-apps/api/tauri";
import FileLog from "./components/FileLog";
import "./App.css";
import AppContainer from "./components/styled/AppContainer";

function App() {
  const [msg, setMsg] = useState("");

  async function subscribe() {
    await invoke("subscribe");
  }

  useEffect(() => {
    const unsub = listen("log-updated", (event) => {
      console.log("updating", event.payload);
      setMsg((old) => old + "\n" + event.payload + "\n");
    });

    return () => {
      unsub.then((u) => u());
    };
  }, []);

  return (
    <AppContainer>
      <FileLog />
      <FileLog />
      <FileLog />
      <FileLog />
      <FileLog />
    </AppContainer>
  );
}

export default App;
