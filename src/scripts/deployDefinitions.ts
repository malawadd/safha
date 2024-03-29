import { writeFileSync } from "fs";
import ceramic from "../lib/ceramic";
import BlockSchema from "../schemas/eth.fundug.Blocks";
import BlockIndexSchema from "../schemas/eth.fundug.BlockIndex";

const run = async () => {
  const client = await ceramic.loadClient();
  await ceramic.authenticateApp(
    "90c5bbfa6066cc2ef348941c7a08f15763aad587dc433fe96b9eb8ac56881924"
  );
  const blockSchema = await ceramic.publishSchema(client, BlockSchema);
  const blockIndexSchema = await ceramic.publishSchema(
    client,
    BlockIndexSchema
  );
  const blocksDefinition = await ceramic.publishDefinition(
    client,
    "eth.doxx.blocks",
    "Content blocks",
    blockIndexSchema
  );
  const config = {
    definitions: {
      blocks: blocksDefinition.id.toString(),
    },
    schemas: {
      Block: blockSchema.commitId.toUrl(),
      BlockIndex: blockIndexSchema.commitId.toUrl(),
    },
  };
  writeFileSync("./config/deployedSchemas.json", JSON.stringify(config));
  console.log(config);
};

run().catch(console.error);