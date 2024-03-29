import { useCallback, useContext } from "react";
import { AppContext } from "../context/AppContext";
import eth from "../lib/eth";
import ceramic from "../lib/ceramic";
import { Web3Provider } from "@ethersproject/providers";
import { IDX } from "@ceramicstudio/idx";
import idx from "../lib/idx";
import CeramicClient from "@ceramicnetwork/http-client";
import { Block, Page } from "../blocks";
import { EditorState } from "draft-js";

function useApp() {
  const { state, dispatch } = useContext(AppContext);

  const loadProvider = useCallback(async () => {
    try {
      dispatch({ type: "provider loading" });
      const [provider, signer, address, ensName] = await eth.loadProvider();
      dispatch({
        type: "provider loaded",
        provider: provider,
        signer: signer,
        address: address,
        ensName: ensName,
      });
    } catch (err) {
      dispatch({ type: "provider failed", error: err });
    }
  }, [dispatch]);

  const loadPages = useCallback(
    async (idxClient: IDX, ceramic: CeramicClient) => {
      try {
        dispatch({ type: "pages loading" });
        const pageIds = await idx.loadPages(idxClient);
        dispatch({ type: "pages loaded", pageIds: pageIds });
      } catch (err) {
        dispatch({ type: "pages failed", error: err });
      }
    },
    [dispatch]
  );

  const loadBlocks = useCallback(
    async (idxClient: IDX, ceramic: CeramicClient) => {
      try {
        dispatch({ type: "blocks loading" });
        const blocks = await idx.loadBlocks(idxClient, ceramic);
        dispatch({ type: "blocks loaded", blocks: blocks });
      } catch (err) {
        dispatch({ type: "blocks failed", error: err });
      }
    },
    [dispatch]
  );

  const loadIDX = useCallback(
    async (provider: Web3Provider) => {
      try {
        dispatch({ type: "idx authenticating" });
        const client = await ceramic.authenticateUser(provider);
        dispatch({ type: "idx authenticated", idx: client });
      } catch (err) {
        dispatch({ type: "idx auth failed", error: err });
      }
    },
    [dispatch]
  );

  const loadCeramic = useCallback(async () => {
    try {
      dispatch({ type: "ceramic loading" });
      const client = await ceramic.loadClient();
      dispatch({ type: "ceramic loaded", ceramic: client });
    } catch (err) {
      dispatch({ type: "ceramic failed", error: err });
    }
  }, [dispatch]);

  const saveNewPage = useCallback(
    async (idxClient: IDX, ceramic: CeramicClient, page: Page) => {
      dispatch({ type: "new page", pageId: page.id });
      dispatch({ type: "new block", block: page });
      dispatch({ type: "save draft block", block: page });
      const { id, saveState, ...pageParams } = page;
      const savedPage = await idx.createPage(idxClient, ceramic, pageParams);
      dispatch({
        type: "save draft block complete",
        block: page,
        savedBlock: savedPage,
      });
      dispatch({
        type: "save page complete",
        pageId: page.id,
        savedPageId: savedPage.id,
      });
    },
    [dispatch]
  );

  const newBlock = useCallback(
    (block: Block, parent: Block) => {
      dispatch({ type: "new block", block: block });
      const updatedParent = {
        ...parent,
        drafts: [...parent.drafts, block.id],
      };
      dispatch({ type: "set block", block: updatedParent });
    },
    [dispatch]
  );

  const saveNewBlock = useCallback(
    async (
      idxClient: IDX,
      ceramic: CeramicClient,
      block: Block,
      parent: Block
    ) => {
      dispatch({ type: "new block", block: block });
      let updatedParent = {
        ...parent,
        drafts: [...parent.drafts, block.id],
      };
      dispatch({ type: "save block", block: updatedParent });
      dispatch({ type: "save draft block", block: block });
      const { id: blockId, saveState: blockSaveState, ...blockParams } = block;
      const savedBlock = await idx.createBlock(idxClient, ceramic, {
        ...blockParams,
        parent: parent.id,
      });
      console.log("savedBlock: ", savedBlock);
      const latestParent =
        state.blocks.blocks.get(parent.id) ||
        state.blocks.drafts.get(parent.id) ||
        parent;
      updatedParent = {
        ...latestParent,
        content: [...latestParent.content, savedBlock.id],
        drafts: latestParent.drafts.filter((id) => id !== block.id),
      };
      const {
        id: parentId,
        saveState: parentSaveState,
        ...parentParams
      } = updatedParent;
      await idx.updateBlock(ceramic, parentParams, parentId);
      let latestBlock =
        state.blocks.blocks.get(block.id) ||
        state.blocks.drafts.get(block.id) ||
        savedBlock;
      console.log("latestBlock: ", latestBlock);
      dispatch({
        type: "save draft block complete",
        block: block,
        savedBlock: {
          ...latestBlock,
          id: savedBlock.id,
          parent: savedBlock.parent,
        },
      });
      dispatch({
        type: "save block complete",
        block: parent,
        savedBlock: updatedParent,
      });
    },
    [dispatch, state.blocks]
  );

  const saveBlock = useCallback(
    async (ceramic: CeramicClient, block: Block) => {
      dispatch({ type: "save block", block: block });
      const { id, saveState, drafts, controllers, ...blockParams } = block;
      await idx.updateBlock(ceramic, blockParams, id);
      dispatch({
        type: "save block complete",
        block: block,
        savedBlock: block,
      });
    },
    [dispatch]
  );

  const setBlock = useCallback(
    async (block: Block) => {
      if (state.blocks.drafts.has(block.id)) {
        dispatch({ type: "set draft block", block: block });
      } else {
        dispatch({ type: "set block", block: block });
      }
    },
    [dispatch, state.blocks]
  );

  const setActivePage = useCallback(
    async (pageId: string) => {
      dispatch({ type: "set active page", pageId: pageId });
    },
    [dispatch]
  );

  const setActiveBlock = useCallback(
    async (blockId: string) => {
      dispatch({ type: "set active block", blockId: blockId });
    },
    [dispatch]
  );

  const setEditorState = useCallback(
    async (key: string, editorState: EditorState) => {
      dispatch({
        type: "set editor state",
        key: key,
        editorState: editorState,
      });
    },
    [dispatch]
  );

  const loadProfile = useCallback(
    async (idxClient: IDX, address: string) => {
      try {
        dispatch({ type: "profile loading" });
        const caip10 = idx.caip10FromAddress(address);
        const { profile, usernames } = await idx.loadProfile(idxClient, caip10);
        dispatch({
          type: "profile loaded",
          profile: profile,
          usernames: usernames,
        });
      } catch (err) {
        dispatch({ type: "profile failed", error: err });
      }
    },
    [dispatch]
  );

  const deletePage = useCallback(
    async (idxClient: IDX, ceramicClient: CeramicClient, pageId: string) => {
      try {
        dispatch({ type: "delete block", blockId: pageId });
        await idx.deletePage(idxClient, ceramicClient, pageId);
        dispatch({ type: "delete block complete", blockId: pageId });
        dispatch({ type: "delete page complete", pageId: pageId });
      } catch (err) {
        console.log(err);
      }
    },
    [dispatch]
  );

  const deleteBlock = useCallback(
    async (idxClient: IDX, ceramicClient: CeramicClient, blockId: string) => {
      try {
        const block =
          state.blocks.blocks.get(blockId) || state.blocks.drafts.get(blockId);
        console.log("deleting block:");
        console.log(blockId);
        console.log(state.blocks.blocks);
        console.log(state.blocks.drafts);

        console.log(block);
        if (block) {
          dispatch({ type: "delete block", blockId: blockId });
          const parent =
            state.blocks.blocks.get(block.parent) ||
            state.blocks.drafts.get(block.parent);
          if (parent) {
            console.log("parent:");
            console.log(parent);
            const updatedParent = {
              ...parent,
              content: parent.content.filter((id) => id !== block.id),
            };
            dispatch({ type: "set block", block: updatedParent });
          }
          await idx.deleteBlock(idxClient, ceramicClient, blockId);
          dispatch({ type: "delete block complete", blockId: blockId });
        }
      } catch (err) {
        console.log(err);
      }
    },
    [dispatch, state.blocks]
  );

  const loadPage = useCallback(
    async (ceramicClient: CeramicClient, pageId: string) => {
      try {
        const page = await ceramic.readBlock(ceramicClient, pageId);
        const children = await ceramic.readBlocks(ceramicClient, page.content);
        [page, ...children].forEach((b) => {
          setBlock(b);
        });
      } catch (err) {
        console.log(err);
      }
    },
    [ setBlock]
  );

  return {
    state,
    loadProvider,
    loadCeramic,
    loadIDX,
    loadPages,
    loadBlocks,
    saveNewPage,
    newBlock,
    saveNewBlock,
    saveBlock,
    setBlock,
    setActivePage,
    setActiveBlock,
    setEditorState,
    loadProfile,
    deletePage,
    deleteBlock,
    loadPage,
  };
}

export default useApp;