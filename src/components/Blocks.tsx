import { Block } from "../blocks";
import Page from "../blocks/Page";
import useApp from "../hooks/useApp";
import useActivePage from "../hooks/useActivePage";

const Blocks = () => {
  const {
    state: {
        blocks: { blocks, drafts },
      },
  } = useApp();
  const { page } = useActivePage();

  const renderBlock = (block: Block) => {
    switch (block.type) {
      case "page":
        return <Page block={block} />;
      default:
        return <div></div>;
    }
  };

  const renderBlocks = (blockIds: string[]) => {
    return blockIds.map((id: string) => {
        const block = blocks.get(id) || drafts.get(id);
      return block && renderBlock(block);
    });
  };

  return <div>{page && renderBlocks(page.content)}</div>;
};

export default Blocks;