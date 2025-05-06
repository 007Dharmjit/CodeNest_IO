// import React from 'react'
import Sidebar from "../components/Sidebar.jsx";
import EditorComponent from "../components/EditorComponent.jsx";
import { useSearchParams } from "react-router-dom";

const Editor = () => {
  const [searchParams] = useSearchParams();
  const folderId = searchParams.get("folderId");
  const folderName = searchParams.get("folderName");

  return (
    <>
      <section className="h-screen w-screen flex overflow-hidden">
        <Sidebar folderId={folderId} folderName={folderName}/>
        <EditorComponent />
      </section>{" "}
    </>
  );
};

export default Editor;
