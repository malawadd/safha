import { Block, Page } from "../blocks";
import useApp from "../hooks/useApp";
import { v4 as uuid } from "uuid";

const createEmptyPage = (): Page => {
  return {
    id: uuid(),
    saveState: "new",
    type: "page",
    properties: {
      title: [["New Page"]],
    },
    content: [],
    format: {
      page_icon: "📑",
    },
    parent: "",
  };
};

const AddBlock = () => {
  const {
    state: { idx, ceramic, activePage },
    newBlock,
    saveNewBlock,
  } = useApp();

  return (
    <button
      onClick={async () => {
        if (idx.status === "done" && ceramic.status === "done" && activePage) {
          const block = createEmptyPage();
          newBlock(block, activePage);
          saveNewBlock(idx.idx, ceramic.ceramic, block, activePage);
        }
      }}
      className="bg-gray-50 hover:bg-gray-100 text-base py-1 px-2 rounded-lg"
    >
      <span>+</span> Add block
    </button>
  );
};

export default AddBlock;