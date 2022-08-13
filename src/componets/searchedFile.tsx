import { useState } from "react";
import { IoChevronForward } from "react-icons/io5";
import { IFile } from "../App";

import "./SearchedFile.css";

interface SearchedFileProps {
  searchKeyword: string;
  searchResult: { file: IFile; indexes: number[] };
  handleSelectSearchedItem: (file: IFile) => void;
}

const SearchedFile = ({
  searchKeyword,
  searchResult,
  handleSelectSearchedItem,
}: SearchedFileProps) => {
  const [fold, setFold] = useState(false);
  const { file, indexes } = searchResult;
  const { name, docs } = file;
  return (
    <div>
      <div
        className="searchedFile"
        style={{ cursor: "pointer" }}
        onClick={() => setFold((prev) => !prev)}
      >
        <IoChevronForward />
        {name.substring(name.lastIndexOf("/") + 1)}
      </div>
      {!fold && (
        <div
          style={{ paddingLeft: "15px", fontSize: "12px", cursor: "pointer" }}
        >
          {indexes.map((index) => (
            <div
              onClick={() => handleSelectSearchedItem(file)}
              style={{ paddingBottom: "5px" }}
            >
              <span className="highlight">
                {docs?.substring(index, index + searchKeyword.length)}
              </span>
              <span>
                {docs?.substring(
                  index + searchKeyword.length,
                  index + searchKeyword.length + 10
                )}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchedFile;
