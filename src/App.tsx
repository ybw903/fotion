import debounce from "lodash.debounce";
import React, { useCallback, useEffect, useState } from "react";
import "./App.css";
import MarkDownViewr from "./componets/MarkDownVierw";
import { searchPattern } from "./utils/search";
import { IoMenu, IoFolderOpen, IoSearch } from "react-icons/io5";
import Directory from "./componets/Directory";
import Input from "./componets/Input";
import SearchedFile from "./componets/searchedFile";

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

const App = () => {
  const [dirs, setDirs] = useState();
  const [menuTab, setMenuTab] = useState(MENU_TYPE.DIRS);
  const [menuFold, setMenuFold] = useState(false);
  const [md, setMD] = useState<undefined | string>();
  const [search, setSearch] = useState("");
  const [selectedItem, setSelectedItem] = useState("");
  const [searchResults, setSearchResults] = useState<
    undefined | { file: IFile; indexes: number[] }[]
  >();

  const handleSelectSearchedItem = (file: IFile) => {
    setMD(file.docs);
  };

  const handleSelectItem = (file: IFile) => {
    const { type, docs, name } = file;
    if (type === "file" && docs) setMD(docs);
    setSelectedItem(name);
  };

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

  const handleChangeSearch = React.useCallback(
    (evt: React.ChangeEvent<HTMLInputElement>) => {
      setSearch(evt.target.value);
      debouncedSearch(evt.target.value);
    },
    [debouncedSearch]
  );

  useEffect(() => {
    window.api.send("toMain", { type: "GET_DIRS" });
    window.api.receive("fromMain", (data) => {
      if (data.type === "SEND_DIRS") {
        setDirs(data.dirs);
      }
    });
  }, []);

  return (
    <div className="App">
      <div className={menuFold ? "leftMenu-fold" : "leftMenu"}>
        <div className="menuHeader">
          {!menuFold && <div>메뉴</div>}
          <div onClick={() => setMenuFold((prev) => !prev)}>
            <IoMenu size={28} />
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
                onClick={() => setMenuTab(MENU_TYPE.SEARCH)}
              >
                <IoSearch size={28} style={{ paddingRight: "5px" }} />
                검색
              </div>
            </div>
          </>
        )}
      </div>
      <div className="main">{md && <MarkDownViewr markdown={md} />}</div>
    </div>
  );
};

export default App;
