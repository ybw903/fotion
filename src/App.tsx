import React, { useEffect, useState } from "react";
import "./App.css";
import MarkDownViewr from "./componets/MarkDownVierw";
interface IFile {
  name: string;
  type: string;
  level: number;
  docs?: string;
  files?: IFile[];
}

const App = () => {
  const [dirs, setDirs] = useState();
  const [md, setMD] = useState<undefined | string>();
  useEffect(() => {
    window.api.send("toMain", { type: "GET_DIRS" });
    window.api.receive("fromMain", (data) => {
      if (data.type === "SEND_DIRS") {
        console.log(data.dirs);
        setDirs(data.dirs);
      }
    });
  }, []);

  const renderDirs = (dirs: IFile) => {
    const { name, type, files, level, docs } = dirs;
    return (
      <div className={type}>
        <div
          key={name}
          className={"item"}
          style={{ paddingLeft: `${10 * level}px` }}
          onClick={() => (type === "file" && docs ? setMD(docs) : undefined)}
        >
          {`${name.substring(name.lastIndexOf("/") + 1)}${
            type === "dir" ? "/" : ""
          }`}
        </div>
        {files && <div>{files.map((file) => renderDirs(file))}</div>}
      </div>
    );
  };

  return (
    <div className="App">
      <div className="leftMenu">
        <div className="menuList">{dirs && renderDirs(dirs)}</div>
      </div>
      <div className="main">{md && <MarkDownViewr markdown={md} />}</div>
    </div>
  );
};

export default App;
