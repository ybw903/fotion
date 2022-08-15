import React, { useCallback, useEffect, useRef, useState } from "react";
import { IoFolderOpenOutline } from "react-icons/io5";
import "./Splash.css";

interface SplashProps {
  workspace: string;
  handleShowOffSplash: () => void;
  handleChangeWorkSpace: (workspace: string) => void;
}

const Splash = ({
  handleShowOffSplash,
  handleChangeWorkSpace,
}: SplashProps) => {
  const dirInputRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [directory, setDirectory] = useState("");

  const handleInputClick = useCallback(() => {
    window.api.send("toMain", { type: "GET_WORKSPACE" });
  }, [inputRef]);

  const handleClickSetting = () => {
    if (!directory || directory.length === 0) return;
    handleChangeWorkSpace(directory);
    handleShowOffSplash();
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!dirInputRef || !dirInputRef.current) return;
      dirInputRef.current.classList.add("splashDir-show");
    }, 3800);
    if (inputRef.current) {
      inputRef.current.setAttribute("directory", "");
      inputRef.current.setAttribute("webkitdirectory", "");
    }
    window.api.receive("fromMain", (data) => {
      if (data.type === "SEND_WORKSPACE") {
        setDirectory(data.workspace);
      }
    });
    return () => clearTimeout(timer);
  }, [dirInputRef]);
  return (
    <div className="splash">
      <div className="spalshTitle">
        <div className="splashTitle-1">F</div>
        <div className="splashTitle-2">o</div>
        <div className="splashTitle-3">t</div>
        <div className="splashTitle-4">i</div>
        <div className="splashTitle-5">o</div>
        <div className="splashTitle-6">n</div>
      </div>
      <div className="splashDescription">당신을 위한 markdown editor</div>
      <div className="splashDir" ref={dirInputRef}>
        <div className="splashDirInputArea">
          <div className="splashDirInputAreaIcon">
            <IoFolderOpenOutline color="#fff" onClick={handleInputClick} />
          </div>

          <input className="splashDirInput" value={directory} readOnly />
        </div>

        <button className="splashDirInputBtn" onClick={handleClickSetting}>
          설정
        </button>
      </div>
    </div>
  );
};

export default Splash;
