import net from "node:net";
import Buffer from "node:buffer";
import { getPeers } from "./tracker.js";

const download = (peer) => {
  const socket = net.Socket();
  socket.on("error", console.log);
  socket.connect(peer.port, peer.ip, () => {
    socket.write(Buffer.from("Hello, World!"));
  });
  socket.on("data", (res) => {
    // do something here with response buffer
  });
};
