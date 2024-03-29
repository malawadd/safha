import Content from "../components/ui/Content";
import Grid from "../components/ui/Grid";
import PagesList from "../components/PagesList";
import Sidebar from "../components/ui/Sidebar";
import StatusPanel from "../components/StatusPanel";
import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import ceramic from "../lib/ceramic";
import idx from "../lib/idx";
import useApp from "../hooks/useApp";
import { InfuraProvider } from "@ethersproject/providers";
import { utils } from "ethers";
import { BasicProfile } from "@ceramicstudio/idx-constants";
import Profile from "../components/ui/Profile";
import Menu from "../components/ui/Menu";
import Button from "../components/ui/Button";
import CeramicClient from "@ceramicnetwork/http-client";
import eth from "../lib/eth";
import { Usernames } from "../schemas";
import CreatePage from "../components/CreatePage";
import poh from "../lib/poh";
import ens, { ENSRecords } from "../lib/ens";

interface Params {
  id: string;
}

const idxClient = ceramic.getReadOnlyIDX();
const provider = eth.getReadOnlyProvider();

const parseENSName = (name: string) => {
  if (name.endsWith(".eth")) {
    return name;
  } else {
    return `${name}.eth`;
  }
};

const parseAddress = (address: string) => {
  return utils.getAddress(address);
};

const parseId = async (id: string, provider: InfuraProvider) => {
  try {
    return [null, parseAddress(id)];
  } catch (e) {
    console.log(e);
    try {
      const name = parseENSName(id);
      return [name, await provider.resolveName(name)];
    } catch (e) {
      console.log(e);
      return [null, null];
    }
  }
};

const getProfile = async (address: string) => {
  try {
    const caip10 = idx.caip10FromAddress(address);
    return await idx.loadProfile(idxClient, caip10);
  } catch (e) {
    console.log(e);
    return { profile: null, usernames: null };
  }
};

const loadPages = async (address: string, ceramicClient: CeramicClient) => {
  try {
    const caip10 = idx.caip10FromAddress(address);
    const pages = await idx.loadUserPages(idxClient, caip10);
    const blocks = await idx.loadUserBlocks(idxClient, ceramicClient, caip10);
    return [pages, blocks] as const;
  } catch (e) {
    console.log(e);
    return [];
  }
};

function ViewProfile() {
  const { id } = useParams<Params>();
  const {
    state: { idx, ceramic },
    loadCeramic,
    setBlock,
  } = useApp();
  let [loadingState, setLoadingState] = useState("pending");
  let [profile, setProfile] = useState<{
    ensName: string | null;
    address: string;
    ensRecords: ENSRecords;
    profile: BasicProfile;
    usernames: Usernames;
  }>();
  let [pages, setPages] = useState<string[]>([]);
  let [verified, setVerified] = useState(false);

  useEffect(() => {
    const loadProfile = async (provider: InfuraProvider) => {
      try {
        const [ensName, address] = await parseId(id, provider);
        let records: ENSRecords = {};
        if (ensName) {
          records = await ens.getTextRecords(provider, ensName);
          console.log(records);
        }
        if (address) {
          const { profile, usernames } = await getProfile(address);
          const verified = await poh.isVerified(provider, address);
          setVerified(!!verified);
          console.log(profile);
          setProfile({
            ensName,
            address,
            ensRecords: records,
            profile: profile || {},
            usernames: usernames || {},
          });
          setLoadingState("loaded");
          if (profile && ceramic.status === "done") {
            console.log("in here");
            const [pages, blocks] = await loadPages(address, ceramic.ceramic);
            console.log(pages);
            if (pages) {
              setPages(pages);
              for (const block of blocks.values()) {
                setBlock(block);
              }
            }
          }
        } else {
          setLoadingState("not found");
        }
      } catch (e) {
        console.log(e);
        setLoadingState("failed");
      }
    };
    if (loadingState === "pending") {
      loadCeramic();
    }
    if (loadingState === "pending" && ceramic.status === "done") {
      setLoadingState("loading");
      loadProfile(provider);
    }
  }, [id, loadingState, ceramic, setBlock, loadCeramic]);

  return (
    <Grid>
      <Sidebar>
        <PagesList content={pages} level={0} edit={idx.status === "done"} />
        <CreatePage icon />
      </Sidebar>
      <div className="lg:hidden fixed top-8 left-12 space-x-2 z-50">
        <div className="bg-white p-2 shadow-md rounded-lg">
          <Link to="/">
            <h1 className="font-script tracking-tighter text-blue-800 text-2xl">
               Safha
            </h1>
          </Link>
        </div>
      </div>
      <Menu>
        {idx.status === "done" && (
          <Link to="/edit/profile">
            <Button onClick={() => {}} primary>
              Edit Profile
            </Button>
          </Link>
        )}
      </Menu>
      <Content>
        {profile && <Profile {...profile} verified={verified} />}
        <StatusPanel />
      </Content>
    </Grid>
  );
}

export default ViewProfile;