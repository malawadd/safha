
import useApp from "../hooks/useApp";
import { createEmptyPage } from "../blocks";


const CreatePage = () => {
  const {
    state: { idx, ceramic },
  
    saveNewPage,
    setActivePage,
   
  } = useApp();

  const onClick = () => {
    if (idx.status === "done" && ceramic.status === "done") {
      const page = createEmptyPage();
      saveNewPage(idx.idx, ceramic.ceramic, page);
      setActivePage(page.id);
    }
  };

  return (
    <>
      {idx.status === "done" && (
        <button
          onClick={onClick}
          className="absolute bottom-0 left-0 w-full p-2 text-left hover:bg-blue-300 border-blue-200 border-t-2"
        >
          <span className="text-xl">+</span> New page
        </button>
      )}
    </>
  );
};

export default CreatePage;