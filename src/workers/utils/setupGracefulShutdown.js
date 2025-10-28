export const setupGracefulShutdown = async (queues) => {
  const shutdown = async () => {
    console.log("Gracefully shutting down worker...");
    for (const queue of queues) {
      await queue.close();
    }
    process.exit(0);
  };

  process.on("SIGINT", shutdown); // Ctrl+C
  process.on("SIGTERM", shutdown); // docker stop / compose down
};
