// Workaround for https://github.com/oven-sh/bun/issues/15679 — Bun's
// net.Socket handling has a bug where writes to adopted-fd sockets
// never flush. Playwright's CDP handshake uses such a socket, so the
// browser hangs forever on launch under Bun. We patch the prototype
// to manually emit the "connect" event that would otherwise never fire.
const net = require("node:net");

const originalConnect = net.Socket.prototype.connect;
net.Socket.prototype.connect = function (...args) {
  let options = args[0];
  if (Array.isArray(options)) options = options[0];
  const hasFd = options && typeof options === "object" && "fd" in options && options.fd != null;

  const result = originalConnect.apply(this, args);

  if (hasFd && this.connecting) {
    this.connecting = false;
    process.nextTick(() => {
      if (!this.destroyed && !this.connected) {
        this.connected = true;
        this.emit("connect");
      }
    });
  }
  return result;
};
