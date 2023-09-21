import mongoose from 'mongoose';
import os from 'os';
import process from 'process';
const _SECONDS = 5000;
export const countConnect = () => {
  const numConnection = mongoose.connections.length;
  return numConnection;
};

// Optional
export const checkOverLoad = () => {
  setInterval(() => {
    const numConnection = mongoose.connections.length;
    const numCores = os.cpus().length;
    const memoryUsage = process.memoryUsage().rss;

    const maxConnections = numCores * 5;
    console.log(`Number of connections: ${numConnection}`);
    console.log(`Memory usage: ${memoryUsage / 1024 / 1024}`);

    if (numConnection > maxConnections) {
      console.log('Connection overload detected');
    }
  }, _SECONDS); // Monitor every 5 seconds
};
