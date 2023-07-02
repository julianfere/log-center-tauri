import FileLog from "./components/FileLog";
import AppContainer from "./components/styled/AppContainer";
import Navbar from "./components/navbar";
import { LogsContainer } from "./components/navbar/styled";
import { open } from "@tauri-apps/api/dialog";
import { useAppContext } from "./context/AppContext";
import { v4 } from "uuid";

function App() {
  const { files, setFiles } = useAppContext();

  const handleAddFile = async () => {
    const files = await open({
      multiple: true,
      filters: [{ extensions: ["log", "txt"], name: "Log files" }],
    });

    if (!files) return;

    if (Array.isArray(files)) {
      const parsedFiles = files.map((file) => {
        return { id: v4(), path: file };
      });
      setFiles((oldFiles) => [...oldFiles, ...parsedFiles]);
    }

    if (typeof files === "string") {
      setFiles((oldFiles) => [...oldFiles, { id: v4(), path: files }]);
    }
  };

  const filesToRender = files.map((file) => (
    <FileLog key={file.id} file={file} />
  ));

  return (
    <AppContainer>
      <Navbar handler={handleAddFile} />
      <LogsContainer>{filesToRender}</LogsContainer>
    </AppContainer>
  );
}

export default App;
