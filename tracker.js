import dgram from "node:dgram";
import { Buffer } from "node:buffer";
import { URL } from "node:url";
import { createAnnounceRequest, parseAnnounceResponse } from "./announce.js";
import { createConnectionRequest, parseConnectionResponse } from "./connection.js";
import { decodeTorrent } from "./torrent.js";

const getPeers = (torrent, callback) => {
  const urlString = String.fromCharCode.apply(null, torrent.announce);
  const url = new URL(urlString);

  const socket = dgram.createSocket("udp4");
  sendMessageUDP(createConnectionRequest(), url, socket);

  socket.on("message", (res) => {
    const resType = parseConnectionResponse(res).action;
    console.log(resType);
    if (resType === 0) {
      // connect
      const connectionResponse = parseConnectionResponse(res);
      const announceRequest = createAnnounceRequest(
        connectionResponse.connectionId,
        torrent
      );
      
    } else if (resType === 1) {
      // announce
      const announceResponse = parseAnnounceResponse(res);
      callback(announceResponse.peers);
    }
  });


};

const sendMessageUDP = (message, url, socket, callback = () => {}) => {
  console.log(message, 0, message.length, url.port, url.hostname, callback);
  socket.send(message, 0, message.length, url.port, url.hostname, callback);
};
//see 3.3

export { getPeers };
