import debounce from "lodash.debounce";
import React, { useCallback } from "react";
import Modal from "../core/Modal";
import useSearch from "../hooks/useSearch";
import { searchPattern } from "../utils/search";
import Input from "./Input";
import "./SearchModal.css";

interface SearchModalProps {
  searchKeyword: string;
  docs: string;
  setMD?: (docs: string) => void;
}

const SearchModal = ({ searchKeyword, docs, setMD }: SearchModalProps) => {
  const debouncedSearch = React.useMemo(
    () =>
      debounce((pattern: string) => {
        // if (!dirs) return;
        // const result = searchDocs(dirs, pattern);
        // setSearchResults(result);
        const result = searchPattern(docs, pattern);
        appendSearchResultHightMDdocs(docs);
      }, 300),
    []
  );
  const appendSearchResultHightMDdocs = (docs: string) => {
    if (!setMD) return;
    const copyedMD = docs;
    const regExp = new RegExp(search, "g");
    const appendedDocs = copyedMD.replace(
      regExp,
      `<span className = 'highlight'>${search}</span>`
    );
    console.log(appendedDocs);
    setMD(appendedDocs);
  };

  const { search, handleChangeSearch } = useSearch(
    searchKeyword,
    debouncedSearch
  );

  return (
    <Modal>
      <div className="searchModal">
        <Input onChange={handleChangeSearch} value={search} />
      </div>
    </Modal>
  );
};

export default SearchModal;
