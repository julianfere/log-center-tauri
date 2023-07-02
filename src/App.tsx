import { useState } from "react";
import FileLog from "./components/FileLog";
import AppContainer from "./components/styled/AppContainer";
import Navbar from "./components/navbar";
import { LogsContainer } from "./components/navbar/styled";

function App() {
  const [files, setFiles] = useState<string[]>([""]);
  return (
    <AppContainer>
      <Navbar />
      <LogsContainer>
        <FileLog />
      </LogsContainer>
    </AppContainer>
  );
}

export default App;
