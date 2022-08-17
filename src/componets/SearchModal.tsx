import debounce from "lodash.debounce";
import React, { useCallback } from "react";
import Modal from "../core/Modal";
import useSearch from "../hooks/useSearch";
import {
  highlightPatternInText,
  removeHightPatternInText,
} from "../utils/strUtil";
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
        console.log(pattern);
        if (!pattern || pattern.length === 0) {
          setMD?.(removeHightPatternInText(docs));
        }
        if (pattern && pattern.length > 0)
          setMD?.(highlightPatternInText(pattern, docs));
      }, 750),
    [docs, setMD]
  );

  const { search, handleChangeSearch } = useSearch(
    searchKeyword,
    debouncedSearch
  );

  return (
    <Modal>
      <div className="searchModal">
        <Input onChange={handleChangeSearch} value={search} autofocus />
      </div>
    </Modal>
  );
};

export default SearchModal;
