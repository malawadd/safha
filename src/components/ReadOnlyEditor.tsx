import { convertFromRaw, EditorState } from "draft-js";
import Editor from "@draft-js-plugins/editor";
import { Block } from "../blocks";
import { createPlugins } from "../components/EditText";
import DisplayText from "../components/ui/Text";

import "draft-js/dist/Draft.css";
import "@draft-js-plugins/emoji/lib/plugin.css";
import "@draft-js-plugins/linkify/lib/plugin.css";
import "prismjs/themes/prism.css";
import { useState } from "react";

interface ReadOnlyEditorProps {
  block: Block;
}

const { plugins } = createPlugins();

const getInitialState = ({ properties }: Block) => {
  const content = properties.title[0][0];
  if (content === "") {
    return EditorState.createEmpty();
  } else {
    return EditorState.createWithContent(convertFromRaw(JSON.parse(content)));
  }
};

const ReadOnlyEditor = ({ block }: ReadOnlyEditorProps) => {
  const [editorState, setEditorState] = useState(getInitialState(block));

  return (
    <DisplayText>
      <Editor
        readOnly
        onChange={(editorState: EditorState) => {
          setEditorState(editorState);
        }}
        plugins={plugins}
        editorState={editorState}
      />
    </DisplayText>
  );
};

export default ReadOnlyEditor;