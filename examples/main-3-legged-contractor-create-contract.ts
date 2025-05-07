import "dotenv/config";
import { getContractorClient } from "./3-legged-contractor";

async function main() {
  // console.log(buffer.byteLength);

  const client = await getContractorClient();

  const construction = await client.createConstruction({
    name: "Test Construction 2",
    address: "amagasaki",
    contractedAt: new Date(),
    period: new Date(),
    advancePaymentRate: 1,
    contractAmount: 10000,
  });

  const list = await client.getConstructionList();
  console.log('constructions', list);

  // const construction = list.constructions?.[0];
  if (!construction) {
    throw new Error("construction not found");
  }

  const contract = await client.createContract({
    constructionId: construction.id!,
    name: "Test Contract 2",
    unitPrice: 100,
    unitVolume: 1,
    contractedAt: new Date(),
    contractorEmail: "masatatsu@detor.co"
  });

  const contracts = await client.getContractList({
    constructionId: construction.id,
  });
  console.log('contracts', contracts);

  // const contract = contracts.contracts?.[0];
  if (!contract) {
    throw new Error("contract not found");
  }
}

new Promise(async () => {
  await main();
});
