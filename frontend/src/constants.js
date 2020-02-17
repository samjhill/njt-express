export const { NODE_ENV } = process.env;

export const URLS = {
  production: "http://167.172.248.184:8000",
  default: "http://localhost:8000",
};

export const serverUrl = URLS[NODE_ENV] || URLS.default;