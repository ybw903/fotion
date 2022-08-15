import React, { useCallback } from "react";
import Modal from "../core/Modal";
import Input from "./Input";
import "./SearchModal.css";

const SearchModal = ({ children }: { children?: React.ReactNode }) => {
  const handleChange = useCallback(
    (evt: React.ChangeEvent<HTMLInputElement>) => {},
    []
  );
  return (
    <Modal>
      <div className="searchModal">
        <Input onChange={handleChange} />
      </div>
    </Modal>
  );
};

export default SearchModal;
