import Content from "../components/ui/Content";
import Grid from "../components/ui/Grid";
import Pages from "../components/PagesList";
import Sidebar from "../components/ui/Sidebar";
import StatusPanel from "../components/StatusPanel";
import PageContent from "../components/ui/Editor";
import Heading from "../components/ui/Heading";

function EditProfile(){
    return (
        <Grid>
            <Sidebar>
                <Pages />
            </Sidebar>
            <Content>
            <PageContent>
                    <p>Edit Profile </p>
                    
                </PageContent>
                <StatusPanel />
            </Content>
        </Grid>
    );
}

export default EditProfile;