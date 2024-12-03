
import { RCDEClient } from "../src/client";

const baseUrl = import.meta.env.BASE_URL;
const clientId = import.meta.env.CLIENT_ID;
const clientSecret = import.meta.env.CLIENT_SECRET;

const client = new RCDEClient({
  baseUrl,
  clientId,
  clientSecret,
});
await client.authenticate();