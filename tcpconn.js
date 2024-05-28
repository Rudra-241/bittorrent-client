import Buffer from "node:buffer";
import { getInfoHash } from "./torrent.js";
export const keepAlive = () => {
  return Buffer.alloc(4);
};

export const choke = () => {
  const buf = Buffer.alloc(5);
  buf.writeUInt32BE(1, 0);
  buf.writeUInt8BE(0, 4);
  return buf;
};

export const unChoke = () => {
  const buf = Buffer.alloc(5);
  buf.writeUInt32BE(1, 0);
  buf.writeUInt8BE(1, 4);
  return buf;
};

export const interested = () => {
  const buf = Buffer.alloc(5);
  buf.writeUInt32BE(1, 0);
  buf.writeUInt8BE(2, 4);
  return buf;
};

export const notInterested = () => {
  const buf = Buffer.alloc(5);
  buf.writeUInt32BE(1, 0);
  buf.writeUInt8BE(3, 4);
  return buf;
};

export const have = (payload) => {
  const buf = Buffer.alloc(9);
  buf.writeUInt32BE(5, 0);
  buf.writeUInt8BE(4, 4);
  buf.writeUInt32BE(payload, 5);
  return buf;
};

export const bitfield = (btf) => {
  const x = btf.length;
  const buf = Buffer.alloc(5 + x);
  buf.writeUInt32BE(x + 1, 0);
  buf.writeUInt8BE(5, 4);
  btf.copy(buf, 5);
  return buf;
};

export const request = () => {
  const buf = Buffer.alloc(17);
  buf.writeUInt32BE(13, 0);
  buf.writeUInt8(6, 4);
  buf.writeUInt32BE(payload.index, 5);
  buf.writeUInt32BE(payload.begin, 9);
  buf.writeUInt32BE(payload.length, 13);
  return buf;
};

export const piece = (payload) => {
  const buf = Buffer.alloc(payload.block.length + 13);
  buf.writeUInt32BE(payload.block.length + 9, 0);
  buf.writeUInt8(7, 4);
  buf.writeUInt32BE(payload.index, 5);
  buf.writeUInt32BE(payload.begin, 9);
  payload.block.copy(buf, 13);
  return buf;
};

export const cancel = (payload) => {
  const buf = Buffer.alloc(17);
  buf.writeUInt32BE(13, 0);
  buf.writeUInt8(8, 4);
  buf.writeUInt32BE(payload.index, 5);
  buf.writeUInt32BE(payload.begin, 9);
  buf.writeUInt32BE(payload.length, 13);
  return buf;
};

export const port = (payload) => {
  const buf = Buffer.alloc(7);
  buf.writeUInt32BE(3, 0);
  buf.writeUInt8(9, 4);
  buf.writeUInt16BE(payload, 5);
  return buf;
};

export const performHandshake = (torrent) => {
  const buf = Buffer.alloc(68);
  buf.writeUInt8(19, 0);
  buf.write("BitTorrent protocol", 1);
  buf.writeUInt32BE(0, 20);
  buf.writeUInt32BE(0, 24);
  getInfoHash(torrent).copy(buf, 28);
  buf.write(util.genId());
  return buf;
};
