import type { NextConfig } from 'next';

const config: NextConfig = {
  // The corpus is read from disk at request time on the server.
  serverExternalPackages: [],
};

export default config;
