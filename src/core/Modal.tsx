import ReactDOM from "react-dom";

const Modal = ({ children }: { children: React.ReactNode }) => {
  return ReactDOM.createPortal(children, document.body);
};

export default Modal;
