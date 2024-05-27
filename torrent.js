import fs from "fs";
import bencode from "bencode";
import { createHash } from "crypto";

// Just a helper function to convert BigInt to Buffers
function bigIntToBuffer(bigInt) {
  if (typeof bigInt !== "bigint") {
    throw new TypeError("Input must be a BigInt");
  }

  // Convert the BigInt to a hex string
  let hex = bigInt.toString(16);

  // Ensure the hex string has an even length
  if (hex.length % 2) {
    hex = "0" + hex;
  }

  // Create a buffer from the hex string
  const buffer = Buffer.from(hex, "hex");

  return buffer;
}

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
      .map((file) => BigInt(file.length)) 
      .reduce((a, b) => a + b, BigInt(0)); 
  } else {
    size = BigInt(torrent.info.length); // Convert to BigInt
  }
  return bigIntToBuffer(size);
};

export { decodeTorrent, getInfoHash, getSize };
