import fs from "fs";
import bencode from "bencode";
import { createHash } from "crypto";



// Just a helper function to convert BigInt to Buffers 
const bigIntToBuffer = (bigint) => {
  let hex = bigint.toString(16);
  if (hex.length % 2) {
    hex = '0' + hex;
  }
  const len = hex.length / 2;
  const u8 = new Uint8Array(len);
  let i = 0;
  let j = 0;
  while (i < len) {
    u8[i] = parseInt(hex.slice(j, j + 2), 16);
    i += 1;
    j += 2;
  }
  return u8;
};


const decodeTorrent = (filepath = "./demo.torrent") => {
  return bencode.decode(fs.readFileSync(filepath));
};

const getInfoHash = (torrent) => {
  return createHash("sha1").update(bencode.encode(torrent.info)).digest();
};

const getSize = (torrent) => {
  let size = BigInt(0);
  if (torrent.info.files) {
    size = torrent.info.files
      .map((file) => file.length)
      .reduce((a, b) => a + b);
  } else {
    size = torrent.info.length;
  }
  return bigIntToBuffer(size);
};




export { decodeTorrent, getInfoHash, getSize };
