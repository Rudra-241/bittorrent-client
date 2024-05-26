import { Buffer } from "node:buffer";
import { randomBytes } from "node:crypto";
import { decodeTorrent, getInfoHash, getSize } from "./torrent.js";

// announce request and response format: https://raw.githubusercontent.com/bittorrent/bittorrent.org/master/beps/bep_0015.rst

const createAnnounceRequest = (connectionID, torrent, port = 6881) => {
  const buf = Buffer.allocUnsafe(98);
  let peerID = null;
  if (!peerID) {
    peerID = randomBytes(20);
    Buffer.from("-SR0001-").copy(peerID, 0);
  }
  Buffer.from(peerID, 0);

  connectionID.copy(buf, 0);
  buf.writeUint32BE(1, 8);
  randomBytes(4).copy(buf, 12);
  getInfoHash(torrent).copy(buf, 16);
  peerID.copy(buf, 36);
  Buffer.alloc(8).copy(buf, 56);
  getSize(torrent).copy(buf, 64);
  Buffer.alloc(8).copy(buf, 72);
  buf.writeUInt32BE(0, 80);
  buf.writeUInt32BE(0, 80);
  randomBytes(4).copy(buf, 88);
  buf.writeInt32BE(-1, 92);
  buf.writeUInt16BE(port, 96);
  return buf;
};

const parseAnnounceResponse = (res) => {
  const group = (iterable, groupSize) => {
    let groups = [];
    for (let i = 0; i < iterable.length; i += groupSize) {
      groups.push(iterable.slice(i, i + groupSize));
    }
    return groups;
  };

  return {
    action: res.readUInt32BE(0),
    transactionId: res.readUInt32BE(4),
    leechers: res.readUInt32BE(8),
    seeders: res.readUInt32BE(12),
    peers: group(res.slice(20), 6).map((address) => {
      return {
        ip: address.slice(0, 4).join("."),
        port: address.readUInt16BE(4),
      };
    }),
  };
};


export { createAnnounceRequest, parseAnnounceResponse };
