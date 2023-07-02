import {
  createContext,
  useContext,
  useState,
  Dispatch,
  SetStateAction,
} from "react";

export type File = {
  id: string;
  path: string;
};

type AppContextType = {
  isWatching: boolean;
  files: File[];
  setIsWatching: Dispatch<SetStateAction<boolean>>;
  setFiles: Dispatch<SetStateAction<File[]>>;
};

const initialState = {
  isWatching: false,
  files: [],
  setIsWatching: (value: boolean | ((prevState: boolean) => boolean)) => {},
  setFiles: (value: File[] | ((prevState: File[]) => File[])) => {},
};

const AppContext = createContext<AppContextType>(initialState);

const { Provider } = AppContext;

const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [isWatching, setIsWatching] = useState(false);
  const [files, setFiles] = useState<File[]>([]);

  return (
    <Provider
      value={{
        isWatching,
        files,
        setIsWatching,
        setFiles,
      }}
    >
      {children}
    </Provider>
  );
};

const useAppContext = () => {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error("useAppContext must be used within an AppProvider");
  }

  return context;
};

export { AppProvider, useAppContext };
