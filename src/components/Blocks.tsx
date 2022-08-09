import { Block } from "../blocks";
import Heading from "../blocks/Heading";
import Page from "../blocks/Page";
import Text from "../blocks/Text";
import useApp from "../hooks/useApp";
import useActivePage from "../hooks/useActivePage";

interface Props {
  enabled: boolean;
}

const Blocks = ({ enabled }: Props) => {
  const {
    state: {
        blocks: { blocks, drafts },
      },
  } = useApp();
  const { page } = useActivePage();

  const renderBlock = (block: Block) => {
    switch (block.type) {
      case "page":
        return <Heading block={block} key={block.key} enabled={enabled} />;
        case "text":
        return <Heading block={block} key={block.key} enabled={enabled} />;
      case "heading-1":
        return <Heading block={block} key={block.key} enabled={enabled} />;
      case "heading-2":
        return <Heading block={block} key={block.key} enabled={enabled} />;
      case "heading-3":
        return <Heading block={block} key={block.key} enabled={enabled} />;
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