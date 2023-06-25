import { invoke } from "@tauri-apps/api";
import { listen } from "@tauri-apps/api/event";

export const subscribeToLogUpdates = async (
  threadId: string,
  callback: (event: any) => void
) => {
  await invoke("subscribe", { threadName: threadId });

  const usubFn = await listen("log-updated", callback);
  return () => {
    usubFn();
  };
};
