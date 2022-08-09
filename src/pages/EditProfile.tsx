import Content from "../components/ui/Content";
import Grid from "../components/ui/Grid";
import Pages from "../components/PagesList";
import Sidebar from "../components/ui/Sidebar";
import StatusPanel from "../components/StatusPanel";
import Editor from "../components/ui/Editor"

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
                <StatusPanel />
            </Content>
        </Grid>
    );
}

export default EditProfile;