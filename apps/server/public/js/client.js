/**
 * Shared browser client: socket lifecycle, resume tokens (localStorage),
 * snapshot state, clock sync. Vanilla ES module — no framework, no CDN.
 */
const LS_PREFIX = "rs-party:";

export function saveIdentity(roomCode, identity) {
  localStorage.setItem(LS_PREFIX + "identity", JSON.stringify({ roomCode, ...identity }));
}
export function loadIdentity() {
  try {
    return JSON.parse(localStorage.getItem(LS_PREFIX + "identity") ?? "null");
  } catch {
    return null;
  }
}
export function clearIdentity() {
  localStorage.removeItem(LS_PREFIX + "identity");
}

export function detectCapabilities() {
  return {
    secureContext: window.isSecureContext,
    wakeLock: "wakeLock" in navigator,
    deviceOrientation: "DeviceOrientationEvent" in window,
    vibration: "vibrate" in navigator,
    camera: !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia),
    microphone: !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia),
    webShare: !!navigator.share,
    webRTC: !!window.RTCPeerConnection,
    indexedDB: !!window.indexedDB,
  };
}

/**
 * Connect and authenticate. Tries resume first (refresh/reconnect must NOT
 * create a new player — spec §10.5), falls back to fresh join.
 */
export async function connectAndAuth(opts) {
  const { io } = await import("/socket.io/socket.io.esm.min.js");
  const socket = io({ transports: ["websocket", "polling"], reconnectionDelayMax: 4000 });

  const result = await new Promise((resolve, reject) => {
    const timeout = setTimeout(() => reject(new Error("JOIN_TIMEOUT")), 8000);
    socket.on("connect", () => {
      const saved = opts.identity;
      const canResume = !!(saved && saved.resumeToken && saved.playerId);
      if (canResume) {
        socket.emit("room:join", {
          roomCode: saved.roomCode,
          playerId: saved.playerId,
          resumeToken: saved.resumeToken,
        }, (ack) => {
          clearTimeout(timeout);
          if (ack.accepted) resolve({ ack, resumed: true });
          else if (opts.freshIdentity) {
            socket.emit("room:join", { roomCode: opts.roomCode, identity: opts.freshIdentity }, (ack2) => {
              if (ack2.accepted) resolve({ ack: ack2, resumed: false });
              else reject(ack2);
            });
          } else reject(ack);
        });
      } else {
        const identity = opts.freshIdentity;
        socket.emit("room:join", { roomCode: opts.roomCode, identity }, (ack) => {
          clearTimeout(timeout);
          if (ack.accepted) resolve({ ack, resumed: false });
          else reject(ack);
        });
      }
    });
    socket.on("connect_error", (err) => console.warn("connect_error", err.message));
  });

  return { socket, ...result };
}

export function onSnapshot(socket, cb) {
  socket.on("state:snapshot", (snap) => cb(snap));
}

export function requestSnapshot(socket) {
  socket.emit("state:sync", {}, () => {});
}

export function syncClock(socket, onOffset) {
  const sample = () => {
    const t0 = Date.now();
    socket.emit("clock:ping", { t0 }, (pong) => {
      const rtt = Date.now() - t0;
      if (rtt < 1500) onOffset(pong.serverTime + rtt / 2 - Date.now());
    });
  };
  sample();
  setInterval(sample, 20_000);
}

export function el(sel) { return document.querySelector(sel); }
export function h(tag, attrs = {}, children = []) {
  const node = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (k === "class") node.className = v;
    else if (k.startsWith("on")) node.addEventListener(k.slice(2), v);
    else if (v !== null && v !== undefined) node.setAttribute(k, v);
  }
  for (const c of [].concat(children)) {
    if (c === null || c === undefined) continue;
    node.append(c.nodeType ? c : document.createTextNode(c));
  }
  return node;
}
