export class ErrorMessageGenerator {
  private static fatalErrors = [
    {
      code: "ECONNRESET",
      message:
        "Connection reset by peer. The server was handling multiple client connections when one of the sockets abruptly closed, causing an unhandled exception and triggering the shutdown sequence.",
    },
    {
      code: "EADDRINUSE",
      message:
        "Address already in use. The server attempted to bind to the configured port, but it is currently occupied by another process, resulting in a fatal bind error and immediate shutdown.",
    },
    {
      code: "ETIMEDOUT",
      message:
        "Operation timed out. A critical operation failed to complete within the expected time frame, indicating network instability or resource starvation, and the server is shutting down to prevent inconsistent state.",
    },
    {
      code: "ECONNREFUSED",
      message:
        "Connection refused. The server attempted to connect to a critical dependent service, which refused the connection, leading to a cascading failure and triggering a controlled shutdown.",
    },
    {
      code: "EPIPE",
      message:
        "Broken pipe. The server attempted to write to a socket that was already closed by the client, resulting in an uncaught exception and initiating server shutdown procedures.",
    },
    {
      code: "ENOTFOUND",
      message:
        "Host not found. A DNS resolution attempt failed for a required external service, causing a fatal error that halted ongoing operations and triggered server shutdown.",
    },
    {
      code: "ENOMEM",
      message:
        "Out of memory. The process exceeded available memory limits during intensive operations, which forced the runtime to abort critical tasks and initiate a shutdown to prevent data corruption.",
    },
  ];

  private static warnings = [
    "High memory usage detected. Current usage is 82%, which is above the recommended threshold. Consider scaling up memory or investigating memory leaks.",
    "CPU usage exceeds threshold. One or more worker threads are consuming excessive CPU time, potentially affecting response times for incoming requests.",
    "Slow response detected on endpoint /api/data. Average response time has exceeded 1200ms for the last 10 requests, indicating potential database latency or resource contention.",
    "Disk usage above 85%. The filesystem storing critical logs and temporary files is nearing full capacity, which may cause failures in file writes and data loss.",
    "Connection pool nearing limit. The number of concurrent database connections is approaching the configured maximum, which may result in refused connections or delayed responses.",
  ];

  static generate(): string {
    const now = new Date().toISOString();

    // Randomly choose fatal or warning
    const type = Math.random() < 0.6 ? "fatal" : "warning"; // slightly more fatal errors

    if (type === "warning") {
      const msg =
        this.warnings[Math.floor(Math.random() * this.warnings.length)];
      return `[WARN] [${now}] ${msg}`;
    } else {
      const error =
        this.fatalErrors[Math.floor(Math.random() * this.fatalErrors.length)];

      const messages = [
        `[ERROR] [${now}] Server encountered a fatal error and is shutting down...`,
        `Error: Uncaught exception: ${error.code}`,
        `Details: ${error.message}`,
        `    at TLSSocket.onConnectReset (node:_tls_wrap:1257:25)`,
        `    at TLSSocket.emit (node:events:517:28)`,
        `    at emitErrorNT (node:internal/streams/destroy:151:8)`,
        `    at process.processTicksAndRejections (node:internal/process/task_queues:83:21)`,
        ``,
        `[INFO] [${now}] Initiating graceful shutdown (SIGTERM received)`,
        `[INFO] [${now}] Closing active HTTP connections (${
          Math.floor(Math.random() * 20) + 1
        } remaining)`,
        `[WARN] [${now}] Timeout while waiting for requests to finish`,
        `[INFO] [${now}] Database connection closed`,
        `[INFO] [${now}] Server shutdown complete. Exiting with code 1`,
      ];

      return messages.join("\n");
    }
  }
}
