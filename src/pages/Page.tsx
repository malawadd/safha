import Content from "../components/Content";
import Grid from "../components/Grid";
import Pages from "../components/PagesList";
import Sidebar from "../components/Sidebar";
import Connections from "../components/Connections";
import PageHeader from "../components/PageHeader";
import Editor from "../components/Editor";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import useApp from "../hooks/useApp";
import ceramic from "../lib/ceramic";
import NotFound from "../components/NotFound";


interface Params {
    id: string;
  }
  
  function Page() {
    let { id } = useParams<Params>();
    let { state, loadCeramic, setActivePage } = useApp();
  let [loadingState, setLoadingState] = useState("loading");

  useEffect(() => {
    loadCeramic();
  }, [loadCeramic]);

  useEffect(() => {
    const loadPage = async () => {
      if (state.ceramic.status === "done") {
        try {
          const page = await ceramic.readBlock(state.ceramic.ceramic, id);
          setActivePage(page);
          setLoadingState("loaded");
          console.log(page);
        } catch (e) {
          setLoadingState("failed");
        }
      }
    };
    loadPage();
  }, [state.ceramic, id, setActivePage]);
    return (
        <Grid>
            <Sidebar>
                <Pages />
            </Sidebar>
            <Content>
            {loadingState === "failed" ? (
          <NotFound />
        ) : (
          <Editor>
            <PageHeader />
          </Editor>
        )}
                <Connections />
            </Content>
        </Grid>
    )
}

export default Page;