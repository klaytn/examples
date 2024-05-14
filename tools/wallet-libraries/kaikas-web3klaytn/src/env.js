const env = {
  CHAIN_ID: +import.meta.env.VITE_CHAIN_ID,
  CHAIN_LABEL: import.meta.env.VITE_CHAIN_LABEL,
  RPC_URL: import.meta.env.VITE_RPC_URL,
  EXPLORER_URL: import.meta.env.VITE_EXPLORER_URL,
};

export default env;
