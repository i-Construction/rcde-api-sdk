import "dotenv/config";
import { getContracteeClient } from "./3-legged-contractee";

async function main() {
  const client = await getContracteeClient();

  const list = await client.getConstructionList();
  console.log('constructions', list);
}

new Promise(async () => {
  await main();
});
