import { getPeers } from "./tracker.js";
import { decodeTorrent } from "./torrent.js";

const torrent = decodeTorrent("./demo.torrent");

getPeers(torrent, peers => {
    console.log('list of peers: ', peers);
  });