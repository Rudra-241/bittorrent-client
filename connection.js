import { randomBytes } from "node:crypto";
import { Buffer } from "node:buffer";

const createConnectionRequest = () => {
  const buf = Buffer.alloc(16);
  buf.writeUint32BE(0x417, 0);
  buf.writeUInt32BE(0x27101980, 4);
  buf.writeUInt32BE(0, 8);
  randomBytes(4).copy(buf, 12);
  return buf;
};

const parseConnectionResponse = (res) => {
  return {
    action: res.readUInt32BE(0),
    transactionId: res.readUInt32BE(4),
    connectionId: res.slice(8),
  };
};

export { createConnectionRequest, parseConnectionResponse };
