import WelcomeButton from "../WelcomeButton";
import { EmojiHero } from "./EmojiHero";

const Welcome = () => {
  return (
    <div className="flex flex-col col-span-3 h-screen justify-center content-center py-36">
      <div className="flex flex-row justify-center">
        <div className="p-16 pb-72">
          <h1 className="font-script tracking-tighter text-blue-800 text-9xl mb-4">
            Safha 
          </h1>
          <div className="text-xl py-2 mb-4 max-w-prose leading-normal rounded bg-blue-50 shadow-sm">
            <div className="flex flex-row px-4 items-center">
              <div>
                <EmojiHero
                  emoji={"📓"}
                  size="4xl"
                  hover={false}
                  onClick={() => {}}
                />
              </div>
              <p className="ml-4 p-4">
                Safha is a web3 notebook linked to your{" "}
                <a
                  className="underline text-blue-500 hover:text-blue-700"
                  href="https://ens.domains/"
                  target="_blank"
                  rel="noreferrer"
                >
                  ENS name
                </a>{" "}
                or{" "}
                <a
                  className="underline text-blue-500 hover:text-blue-700"
                  href="https://ethereum.org/wallets/"
                  target="_blank"
                  rel="noreferrer"
                >
                  Ethereum address
                </a>
                . It uses{" "}
                <a
                  className="underline text-blue-500 hover:text-blue-700"
                  href="https://idx.xyz/"
                  target="_blank"
                  rel="noreferrer"
                >
                  IDX
                </a>
                ,{" "}
                <a
                  className="underline text-blue-500 hover:text-blue-700"
                  href="https://ceramic.network/"
                  target="_blank"
                  rel="norefferrer"
                >
                  Ceramic
                </a>
                ,{" "}
                <a
                  className="underline text-blue-500 hover:text-blue-700"
                  href="https://ipfs.io/"
                  target="_blank"
                  rel="noreferrer"
                >
                  IPFS
                </a>
                , and{" "}
                <a
                  className="underline text-blue-500 hover:text-blue-700"
                  href="https://web3.storage/"
                  target="_blank"
                  rel="noreferrer"
                >
                  Web3.storage
                </a>{" "}
                to publish your documents on the decentralized web.
              </p>
            </div>
            <div className="flex flex-row px-4">
              <div>
                <EmojiHero
                  emoji={"✍🏾"}
                  size="4xl"
                  hover={false}
                  onClick={() => {}}
                />
              </div>
              <p className="ml-4 p-4">
                Use Safha as a blog, profile, journal, homepage, and more. Edit
                text, upload files and images, and embed content.
              </p>
            </div>
            <div className="flex flex-row px-4">
              <div>
                <EmojiHero
                  emoji={"☘️"}
                  size="4xl"
                  hover={false}
                  onClick={() => {}}
                />
              </div>
              <p className="ml-4 p-4">
                All Safhat are public 
              </p>
            </div>
          </div>
          {/* <WelcomeButton /> */}
        </div>
      </div>
    </div>
  );
};

export default Welcome;