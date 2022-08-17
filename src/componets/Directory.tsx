import React, { useEffect, useRef, useState } from "react";
import {
  IoAddCircleOutline,
  IoChevronForward,
  IoDocumentTextOutline,
  IoFolderOpen,
  IoReader,
} from "react-icons/io5";
import { IFile } from "../Main";
import Dropdown from "./Dropdown";

interface DirectoryProps {
  dirs: IFile;
  selectedItem: string;
  handleSelectItem: (dir: IFile) => void;
  workSpace: string;
  show?: boolean;
}

const Directory = ({
  dirs,
  handleSelectItem,
  selectedItem,
  workSpace,
  show = true,
}: DirectoryProps) => {
  const { name, type, files, level, docs } = dirs;
  const [fold, setFold] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const compositeHandleSelectItem = (dir: IFile) => {
    handleSelectItem(dir);
    if (dir.type === "dir") setFold((prev) => !prev);
  };

  const handleClickAddBtn = (evt: React.MouseEvent<HTMLOrSVGElement>) => {
    evt.preventDefault();
    evt.stopPropagation();
    setShowDropdown((prev) => !prev);
  };

  const [addFile, setAddFile] = useState<undefined | string>();
  const [addFileName, setAddFileName] = useState("");

  const mountItem = (type: string) => {
    setAddFile(type);
    setShowDropdown(false);
    setFold(false);
  };

  const handleClickDropdownItem = (type: string) => {
    mountItem(type);
  };

  return (
    <div className={type} style={{ display: show ? "block" : "none" }}>
      <div
        key={name}
        className={name === selectedItem ? "item-selected" : "item"}
        style={{ paddingLeft: `${10 * level}px`, cursor: "pointer" }}
        onClick={() => compositeHandleSelectItem(dirs)}
      >
        {type === "dir" && <IoChevronForward />}
        {`${name.substring(name.lastIndexOf("/") + 1)}`}
        {name === selectedItem && type === "dir" && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
            }}
          >
            <IoAddCircleOutline
              size={20}
              style={{ paddingLeft: "5px" }}
              onClick={handleClickAddBtn}
              cursor={"pointer"}
            />
            {showDropdown && (
              <Dropdown
                dirs={dirs}
                handleClickDropdownItem={handleClickDropdownItem}
              />
            )}
          </div>
        )}
      </div>
      {addFile && (
        <div
          style={{
            paddingLeft: `${10 * level} px`,
            paddingBlock: "5px",
            display: "flex",
            alignItems: "center",
          }}
        >
          {addFile === "FILE" ? <IoDocumentTextOutline /> : <IoFolderOpen />}
          <input
            style={{
              marginLeft: "5px",
              padding: "5px",
              border: "none",
              borderRadius: "5px",
            }}
            onChange={(evt) => setAddFileName(evt.currentTarget.value)}
            autoFocus
            onBlur={() => {
              setAddFile(undefined);
              setAddFileName("");
              if (!addFileName || addFileName.length === 0) return;
              window.api.send("toMain", {
                type: addFile === "FILE" ? "MAKE_FILE" : "MAKE_DIR",
                dirName: `${dirs.name}/${addFileName}`,
                workSpace,
              });
            }}
            onKeyDown={(evt) => {
              if (evt.key === "Enter") {
                setAddFile(undefined);
                setAddFileName("");
                if (!addFileName || addFileName.length === 0) return;
                window.api.send("toMain", {
                  type: addFile === "FILE" ? "MAKE_FILE" : "MAKE_DIR",
                  dirName: `${dirs.name}/${addFileName}`,
                  workSpace,
                });
              }
            }}
          />
        </div>
      )}
      {/* {files && !fold && (
        <div>
          {files.map((file) => (
            <Directory
              workSpace={workSpace}
              dirs={file}
              handleSelectItem={handleSelectItem}
              selectedItem={selectedItem}
              key={name}
            />
          ))}
        </div>
      )} */}
      {files && (
        <div>
          {files.map((file, i) => (
            <Directory
              workSpace={workSpace}
              dirs={file}
              handleSelectItem={handleSelectItem}
              selectedItem={selectedItem}
              key={`${level}-${name}-${i}`}
              show={!fold}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Directory;
