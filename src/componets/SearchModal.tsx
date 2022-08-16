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
        if (pattern && pattern.length > 0)
          appendSearchResultHightMDdocs(pattern);
      }, 750),
    []
  );
  const appendSearchResultHightMDdocs = (pattern: string) => {
    if (!setMD) return;

    const copyedMD = docs;
    const regExp = new RegExp(pattern, "g");

    const appendedDocs = copyedMD.replace(
      regExp,
      `<span className = 'highlight'>${pattern}</span>`
    );
    setMD(appendedDocs);
  };

  const { search, handleChangeSearch } = useSearch(
    searchKeyword,
    debouncedSearch
  );

  return (
    <Modal>
      <div className="searchModal">
        <div>{search}</div>
        <Input onChange={handleChangeSearch} value={search} autofocus />
      </div>
    </Modal>
  );
};

export default SearchModal;
