import { Embed as EmbedBlock } from "../blocks";
import { useState } from "react";
import useApp from "../hooks/useApp";
import DisplayEmbed from "./ui/DisplayEmbed";

interface Props {
    block: EmbedBlock;
}

const SelectEmbed = ({ block }: Props) => {
    const {
      state: { ceramic },
      saveBlock,
    } = useApp();
    const [saved, setSaved] = useState(!!block.properties.source[0][0]);
    const [edit, setEdit] = useState(!block.properties.source[0][0]);
    const [url, setUrl] = useState(block.properties.source[0][0] || "");
  
    const onURLChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
      setUrl(evt.target.value);
    };
  
    const onEdit = () => {
      setEdit(true);
    };
  
    const onSubmit = () => {
      const newBlock = {
        ...block,
        properties: {
          ...block.properties,
          source: [[url]],
        },
      };
      if (ceramic.status === "done") {
        saveBlock(ceramic.ceramic, newBlock);
        setSaved(true);
        setEdit(false);
      }
    };
  
    return (
      <div className="my-4 p-4 rounded bg-gray-100">
        <div className="flex flex-row items-center">
          <span className="text-2xl mr-4">🛌</span>
          <div className="flex flex-row flex-grow gap-x-1">
            <input
              className="flex-grow max-w-72 px-2 py-1 mr-4 border border-gray-300 rounded p-4 focus:border-purple-600 focus:outline-none"
              type="text"
              name="url"
              placeholder="URL"
              value={url}
              autoComplete="off"
              onChange={onURLChange}
              disabled={!edit || block.saveState !== "saved"}
            />
            <button
              className="cursor-pointer bg-gray-200 hover:bg-gray-300 py-1 px-2 rounded-lg shadow-sm"
              onClick={edit ? onSubmit : onEdit}
            >
              {edit ? "Save" : "Edit"}
            </button>
          </div>
        </div>
        <div className="mt-4 flex flex-row justify-center content-center">
          {saved && <DisplayEmbed url={url} />}
        </div>
      </div>
    );
  };
  
  export default SelectEmbed;