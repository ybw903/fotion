import { useState } from "react";
import { IoChevronForward } from "react-icons/io5";
import { IFile } from "../Main";

interface DirectoryProps {
  dirs: IFile;
  selectedItem: string;
  handleSelectItem: (dir: IFile) => void;
}

const Directory = ({
  dirs,
  handleSelectItem,
  selectedItem,
}: DirectoryProps) => {
  const { name, type, files, level, docs } = dirs;
  const [fold, setFold] = useState(false);

  const compositeHandleSelectItem = (dir: IFile) => {
    handleSelectItem(dir);
    if (dir.type === "dir") setFold((prev) => !prev);
  };
  return (
    <div className={type}>
      <div
        key={name}
        className={name === selectedItem ? "item-selected" : "item"}
        style={{ paddingLeft: `${10 * level}px`, cursor: "pointer" }}
        onClick={() => compositeHandleSelectItem(dirs)}
      >
        {type === "dir" && <IoChevronForward />}
        {`${name.substring(name.lastIndexOf("/") + 1)}`}
      </div>
      {files && !fold && (
        <div>
          {files.map((file) => (
            <Directory
              dirs={file}
              handleSelectItem={handleSelectItem}
              selectedItem={selectedItem}
              key={name}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Directory;
