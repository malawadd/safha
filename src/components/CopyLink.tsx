import { useState } from "react";
import { Page } from "../blocks";
import useApp from "../hooks/useApp";

const CopyLink = () => {
  const {
    state: { activePage },
  } = useApp();
  const [copyStatus, setCopyStatus] = useState("pending");

  const copy = async (page: Page) => {
    const path = page.id.split("://")[1];
    const url = `http://localhost:3000/pages/${path}`;
    await navigator.clipboard.writeText(url);
    setCopyStatus("copied");
    setTimeout(() => {
      setCopyStatus("pending");
    }, 1800);
  };


  return (
    <span>
      {activePage && (
        <button
          onClick={() => copy(activePage )}
          className="bg-gray-100 hover:bg-gray-300 py-1 px-2 rounded-lg shadow-md"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 inline"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z"
              clipRule="evenodd"
            />
          </svg>{" "}
          {copyStatus === "pending" ? "Copy Link" : "Link Copied!"}
        </button>
      )}
    </span>
  );
};

export default CopyLink;