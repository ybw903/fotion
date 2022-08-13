import React from "react";
import "./input.css";

interface InputProps {
  placeholder?: string;
  onChange: (evt: React.ChangeEvent<HTMLInputElement>) => void;
  value?: string;
}

const Input = ({ placeholder, onChange, value }: InputProps) => {
  return (
    <input
      className="input"
      placeholder={placeholder}
      onChange={onChange}
      value={value}
    ></input>
  );
};

export default Input;
