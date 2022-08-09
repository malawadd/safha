import Content from "../components/Content";
import Grid from "../components/Grid";
import Pages from "../components/PagesList";
import Sidebar from "../components/Sidebar";
import Connections from "../components/Connections";
import Blocks from "../components/PageHeader";
import Editor from "../components/Editor";

function EditProfile(){
    return (
        <Grid>
            <Sidebar>
                <Pages />
            </Sidebar>
            <Content>
                <Editor>
                    <p>Edit Profile </p>
                    
                </Editor>
                <Connections />
            </Content>
        </Grid>
    );
}

export default EditProfile;