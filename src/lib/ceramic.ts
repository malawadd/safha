
import CeramicClient from "@ceramicnetwork/http-client";
import ThreeIdResolver from "@ceramicnetwork/3id-did-resolver";
import KeyDidResolver from "key-did-resolver";
import { Ed25519Provider } from "key-did-provider-ed25519";
import { fromString } from "uint8arrays";
import { DID } from "dids";
import { ThreeIdConnect, EthereumAuthProvider } from "@3id/connect";
import { Web3Provider } from "@ethersproject/providers";
import { IDX } from "@ceramicstudio/idx";
import * as IDXTools from "@ceramicstudio/idx-tools";
import { TileDocument } from "@ceramicnetwork/stream-tile";
import { Schema } from "../schemas";
import { definitions } from "../config/deployedSchemas.json";

const API_URL = "https://ceramic-clay.3boxlabs.com";
const ceramic = new CeramicClient("https://ceramic-clay.3boxlabs.com");

const resolver = {
  ...KeyDidResolver.getResolver(),
  ...ThreeIdResolver.getResolver(ceramic),
};

const CERAMIC_DID = new DID({ resolver });

const loadClient = async ()=>{
    await ceramic.setDID(CERAMIC_DID);
    return ceramic;
}

const authenticateUser = async (provider: Web3Provider) => {
  const signer = await provider.getSigner();
  const address = await signer.getAddress();
  const threeIdConnect = new ThreeIdConnect();
  const authProvider = new EthereumAuthProvider(provider.provider, address);
  await threeIdConnect.connect(authProvider);
  const didProvider = await threeIdConnect.getDidProvider();
  ceramic.did?.setProvider(didProvider);
  await ceramic.did?.authenticate();
  const idx = new IDX({ ceramic, aliases: definitions });
  return idx;
};


const authenticateApp = async (seed: string) => {
    const seedArray = fromString(seed, "base16");
    const provider = new Ed25519Provider(seedArray);
    const did = new DID({ provider, resolver });
    await ceramic.setDID(did);
    await ceramic.did?.authenticate();
  }; 

  const publishSchema = async (ceramic: CeramicClient, schema: Schema) => {
    const publishedSchema = await IDXTools.publishSchema(ceramic, {
      name: schema.title,
      content: schema,
    });
    return publishedSchema;
  };

  const publishDefinition = async (
    ceramic: CeramicClient,
    definitionName: string,
    definitionDescription: string,
    schema: TileDocument
  ) => {
    return await IDXTools.createDefinition(ceramic, {
      name: definitionName,
      description: definitionDescription,
      schema: schema.commitId.toUrl(),
    });
  };

  const exp = {
    loadClient,
    authenticateUser,
    authenticateApp,
    publishSchema,
    publishDefinition,
  };
  
  export default exp;