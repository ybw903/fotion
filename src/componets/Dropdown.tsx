import React from "react";
import { IFile } from "../Main";
import "./Dropdown.css";

const Dropdown = ({
  dirs,
  handleClickDropdownItem,
}: {
  dirs: IFile;
  handleClickDropdownItem: (type: string) => void;
}) => {
  const handleClickAddDir = (evt: React.MouseEvent) => {
    evt.stopPropagation();
    handleClickDropdownItem("DIR");
  };

  const handleClickAddFile = (evt: React.MouseEvent) => {
    evt.stopPropagation();
    handleClickDropdownItem("FILE");
  };
  return (
    <div className="dropdown">
      <li onClick={(evt) => handleClickAddDir(evt)}>폴더 추가</li>
      <li onClick={(evt) => handleClickAddFile(evt)}>파일 추가</li>
    </div>
  );
};

export default Dropdown;
