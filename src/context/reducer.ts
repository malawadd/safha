import CeramicClient from "@ceramicnetwork/http-client";
import { IDX } from "@ceramicstudio/idx";
import { JsonRpcSigner, Web3Provider } from "@ethersproject/providers";
import { Block } from "../blocks";

type PendingStatus = "pending" | "loading";

type ProviderPendingState = { status: PendingStatus };
type ProviderFailedState = { status: "failed"; error: Error };
export type ProviderLoadedState = {
  status: "done";
  provider: Web3Provider;
  signer: JsonRpcSigner;
  address: string;
  ensName: string;
};
type ProviderState =
  | ProviderPendingState
  | ProviderFailedState
  | ProviderLoadedState;

type CeramicAuthPendingState = { status: PendingStatus };
type CeramicAuthFailedState = { status: "failed"; error: Error };
type CeramicAuthDoneState = { status: "done"; idx: IDX };

type CeramicAuthState =
  | CeramicAuthPendingState
  | CeramicAuthFailedState
  | CeramicAuthDoneState;
type CeramicPendingState = { status: PendingStatus; auth: CeramicAuthState };
type CeramicFailedState = {
  status: "failed";
  error: Error;
  auth: CeramicAuthState;
};
export type CeramicLoadedState = {
  status: "done";
  ceramic: CeramicClient;
  auth: CeramicAuthState;
};
export type CeramicState =
  | CeramicPendingState
  | CeramicFailedState
  | CeramicLoadedState;

type BlocksPendingState = { status: PendingStatus };
type BlocksFailedState = { status: "failed"; error: Error };
type BlocksLoadedState = { status: "done"; blocks: Block[] };
type BlocksState = BlocksPendingState | BlocksFailedState | BlocksLoadedState;

export interface State {
  provider: ProviderState;
  ceramic: CeramicState;
  blocks: BlocksState;
}

export type LoadProvider = { type: "provider loading" };
export type LoadProviderFailed = { type: "provider failed"; error: Error };
export type SetProvider = {
  type: "provider loaded";
  provider: Web3Provider;
  signer: JsonRpcSigner;
  address: string;
  ensName: string;
};
export type ProviderAction = LoadProvider | LoadProviderFailed | SetProvider;

export type LoadCeramic = { type: "ceramic loading" };
export type LoadCeramicFailed = { type: "ceramic failed"; error: Error };
export type SetCeramic = { type: "ceramic loaded"; ceramic: CeramicClient };
export type CeramicAction = LoadCeramic | LoadCeramicFailed | SetCeramic;

export type AuthenticateCeramic = { type: "ceramic authenticating" };
export type AuthenticateCeramicFailed = {
  type: "ceramic auth failed";
  error: Error;
};
export type CeramicAuthenticated = {
  type: "ceramic authenticated";
  idx: IDX;
};
export type CeramicAuthAction =
  | AuthenticateCeramic
  | AuthenticateCeramicFailed
  | CeramicAuthenticated;

export type LoadBlocks = { type: "blocks loading" };
export type LoadBlocksFailed = { type: "blocks failed"; error: Error };
export type SetBlocks = { type: "blocks loaded"; blocks: Block[] };
export type BlocksAction = LoadBlocks | LoadBlocksFailed | SetBlocks;

export type Action =
  | ProviderAction
  | CeramicAction
  | CeramicAuthAction
  | BlocksAction;

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "provider loading":
      return {
        ...state,
        provider: { status: "loading" },
      };
    case "provider loaded":
      return {
        ...state,
        provider: {
          status: "done",
          provider: action.provider,
          signer: action.signer,
          address: action.address,
          ensName: action.ensName,
        },
      };
    case "provider failed":
      return {
        ...state,
        provider: { status: "failed", error: action.error },
      };
    case "ceramic loading":
      return {
        ...state,
        ceramic: { status: "loading", auth: { status: "pending" } },
      };
    case "ceramic loaded":
      return {
        ...state,
        ceramic: {
          status: "done",
          ceramic: action.ceramic,
          auth: { status: "pending" },
        },
      };
    case "ceramic failed":
      return {
        ...state,
        ceramic: {
          status: "failed",
          error: action.error,
          auth: { status: "pending" },
        },
      };
    case "ceramic authenticating":
      return {
        ...state,
        ceramic: { ...state.ceramic, auth: { status: "loading" } },
      };
    case "ceramic authenticated":
      return {
        ...state,
        ceramic: {
          ...state.ceramic,
          auth: { status: "done", idx: action.idx },
        },
      };
    case "ceramic auth failed":
      return {
        ...state,
        ceramic: {
          ...state.ceramic,
          auth: { status: "failed", error: action.error },
        },
      };
    case "blocks loading":
      return {
        ...state,
        blocks: { status: "loading" },
      };
    case "blocks loaded":
      return {
        ...state,
        blocks: { status: "done", blocks: action.blocks },
      };
    case "blocks failed":
      return {
        ...state,
        blocks: { status: "failed", error: action.error },
      };
    default:
      return state;
  }
};

export const initialState: State = {
  provider: { status: "pending" },
  ceramic: { status: "pending", auth: { status: "pending" } },
  blocks: { status: "pending" },
};