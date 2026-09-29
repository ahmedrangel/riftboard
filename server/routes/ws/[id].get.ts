import { createWebSocketProxy } from "crossws";

const proxy = createWebSocketProxy({
  connectTimeout: 60000, // Set the connection timeout to 60 seconds
  target: async (peer) => {
    const { pathname } = new URL(peer.request.url);
    const id = pathname.split("/").filter(Boolean).pop();
    if (!id) {
      throw new Error("Missing id");
    }
    const target = await kv.get<string>(id);
    if (!target) {
      throw new Error("Target not found");
    }
    return target.replace(/^https:/, "wss:");
  }
});

proxy.error = (peer) => {
  peer.close(1013, "Target unavailable");
};

export default defineWebSocketHandler(proxy);
