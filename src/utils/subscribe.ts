import { listen } from "@tauri-apps/api/event";

export const subscribeToLogUpdates = async (
  threadId: string,
  callback: (event: any) => void
) => {
  const usubFn = await listen(`log-updated:${threadId}`, callback);
  return () => {
    usubFn();
  };
};
