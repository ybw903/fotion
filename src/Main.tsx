import debounce from "lodash.debounce";
import React, { useCallback, useEffect, useRef, useState } from "react";
import "./Main.css";
import MarkDownViewr from "./componets/MarkDownVierw";
import { searchPattern } from "./utils/search";
import {
  IoMenu,
  IoFolderOpen,
  IoSearch,
  IoAddCircleOutline,
  IoAddCircle,
} from "react-icons/io5";
import Directory from "./componets/Directory";
import Input from "./componets/Input";
import SearchedFile from "./componets/searchedFile";
import SearchModal from "./componets/SearchModal";
import useSearch from "./hooks/useSearch";

export interface IFile {
  name: string;
  type: string;
  level: number;
  docs?: string;
  files?: IFile[];
}

enum MENU_TYPE {
  DIRS = "DIRS",
  SEARCH = "SEARCH",
}

interface MainProps {
  workspace: string;
}

const Main = ({ workspace }: MainProps) => {
  const [dirs, setDirs] = useState();
  const [menuTab, setMenuTab] = useState(MENU_TYPE.DIRS);
  const [menuFold, setMenuFold] = useState(false);
  const [md, setMD] = useState<undefined | { file?: IFile; docs?: string }>();

  const [selectedItem, setSelectedItem] = useState("");
  const [searchResults, setSearchResults] = useState<
    undefined | { file: IFile; indexes: number[] }[]
  >();
  const [showSearchModal, setShowSearchModal] = useState(false);

  const textAreaRef = useRef<HTMLTextAreaElement | null>(null);

  const [editMode, setEditMode] = useState(false);

  const searchDocs = useCallback((file: IFile, pattern: string) => {
    const result = [];
    if (file.type === "file" && file.docs) {
      const indexes = searchPattern(file.docs, pattern);
      result.push({ file: file, indexes: indexes });
    }
    if (file.type === "dir") {
      file.files?.forEach((file) => {
        const currentResult = searchDocs(file, pattern);
        result.push(...currentResult);
      });
    }
    return result;
  }, []);

  const debouncedSearch = React.useMemo(
    () =>
      debounce((pattern: string) => {
        if (!dirs) return;
        const result = searchDocs(dirs, pattern);
        setSearchResults(result);
      }, 300),
    [dirs, searchDocs]
  );

  const { search, handleChangeSearch } = useSearch("", debouncedSearch);

  // const appendSearchResultHightMDdocs = (file: IFile) => {
  //   if (!file.docs) return;
  //   const copyedMD = file.docs;
  //   const regExp = new RegExp(search, "g");
  //   const appendedDocs = copyedMD.replace(
  //     regExp,
  //     `<span className = 'highlight'>${search}</span>`
  //   );
  //   setMD(appendedDocs);
  // };

  const handleSelectSearchedItem = (file: IFile) => {
    setShowSearchModal(true);
    const nextMD = {
      ...file,
      docs: file.docs,
    };
    setMD(nextMD);
  };

  const handleSelectItem = (file: IFile) => {
    const { type, docs, name } = file;
    if (type === "file") {
      setEditMode(false);
      setMD({ file, docs });
    }
    setSelectedItem(name);
  };

  const handleChangeDocs = (evt: React.ChangeEvent<HTMLTextAreaElement>) => {
    const nextMD = {
      ...md,
      docs: evt.target.value,
    };
    setMD(nextMD);
  };

  const handleSaveDocs = () => {
    const rootDir = workspace.substring(0, workspace.lastIndexOf("/"));
    console.log(rootDir);
    // if (md && md.file && md.docs)
    //   window.api.send("toMain", {
    //     type: "SAVE_DOCS",
    //     dir: `${rootDir}/${md.file.name}`,
    //     docs: md.docs,
    //     workspace,
    //   });
    if (md && md.file && md.docs)
      window.api.send("toMain", {
        type: "SAVE_DOCS",
        dir: `${md.file.name}`,
        docs: md.docs,
        workspace,
      });
    setEditMode(false);
  };

  useEffect(() => {
    window.api.send("toMain", { type: "GET_DIRS", workspace });
    window.api.receive("fromMain", (data) => {
      if (data.type === "SEND_DIRS") {
        setDirs(data.dirs);
      }
      if (data.type === "SEND_SEARCH") {
        console.log("rr");
        setShowSearchModal((prev) => !prev);
      }
    });
  }, []);
  console.log(md, selectedItem);
  return (
    <>
      <div className={menuFold ? "leftMenu-fold" : "leftMenu"}>
        <div className="menuHeader">
          {!menuFold && <div>메뉴</div>}
          <div onClick={() => setMenuFold((prev) => !prev)}>
            <IoMenu size={28} style={{ cursor: "pointer" }} />
          </div>
        </div>
        {!menuFold && (
          <>
            <div className="menu">
              {menuTab === MENU_TYPE.DIRS && (
                <div className="menuList">
                  {dirs && (
                    <Directory
                      dirs={dirs}
                      handleSelectItem={handleSelectItem}
                      selectedItem={selectedItem}
                      workSpace={workspace}
                    />
                  )}
                </div>
              )}
              {menuTab === MENU_TYPE.SEARCH && (
                <div className="menuSearch">
                  <Input
                    placeholder="검색창"
                    onChange={handleChangeSearch}
                    value={search}
                  ></Input>
                  <div className="searchdResult">
                    {searchResults &&
                      searchResults.map(
                        (searchResult) =>
                          searchResult.indexes.length > 0 && (
                            <SearchedFile
                              searchKeyword={search}
                              searchResult={searchResult}
                              handleSelectSearchedItem={
                                handleSelectSearchedItem
                              }
                            />
                          )
                      )}
                  </div>
                </div>
              )}
            </div>
            <div className="selectMenuTab">
              <div
                className="menuTab"
                onClick={() => setMenuTab(MENU_TYPE.DIRS)}
              >
                <IoFolderOpen size={28} style={{ paddingRight: "5px" }} />
                디렉토리
              </div>
              <div
                className="menuTab"
                onClick={() => {
                  setEditMode(false);
                  setMenuTab(MENU_TYPE.SEARCH);
                }}
              >
                <IoSearch size={28} style={{ paddingRight: "5px" }} />
                검색
              </div>
            </div>
          </>
        )}
      </div>
      <div className={menuFold ? "main-fold" : "main"}>
        {md && (
          <div className="viewr">
            {editMode && (
              <textarea
                className="editTextArea"
                value={md.docs}
                onChange={handleChangeDocs}
              />
            )}
            <div className={!editMode ? "mdViewr" : "mdViewr-edit"}>
              <MarkDownViewr
                markdown={md.docs ?? ""}
                editMode={editMode}
                handleChangeEditMode={() => {
                  setEditMode((prev) => !prev);
                }}
                handleSaveDocs={handleSaveDocs}
              />
            </div>
          </div>
        )}
      </div>
      {md && md.docs && showSearchModal && (
        <SearchModal
          searchKeyword={search}
          docs={md.docs}
          setMD={(docs: string) => setMD({ ...md, docs: docs })}
        />
      )}
    </>
  );
};

export default Main;
