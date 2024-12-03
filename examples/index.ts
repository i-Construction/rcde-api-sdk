
import { RCDEClient } from "../src/client";

const baseUrl = import.meta.env.VITE_API_BASE_URL;
const clientId = import.meta.env.VITE_CLIENT_ID;
const clientSecret = import.meta.env.VITE_CLIENT_SECRET;

const client = new RCDEClient({
  baseUrl,
  clientId,
  clientSecret,
});
await client.authenticate();