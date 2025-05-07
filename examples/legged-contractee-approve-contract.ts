import "dotenv/config";
import { getContracteeClient } from "./3-legged-contractee";

async function main() {
  const client = await getContracteeClient();
  const res = await client.approveContract(10);
  console.log(res);
}

new Promise(async () => {
  await main();
});
