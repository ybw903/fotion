import React, { useEffect, useState } from "react";
import "./App.css";
interface IFile {
  name: string;
  type: string;
  level: number;
  files?: IFile[];
}

const App = () => {
  const [dirs, setDirs] = useState();
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
    const { name, type, files, level } = dirs;
    return (
      <>
        <div
          key={name}
          className="dir"
          style={{ paddingLeft: `${10 * level}px` }}
        >
          {`${name.substring(name.lastIndexOf("/") + 1)}${
            type === "dir" ? "/" : ""
          }`}
        </div>
        {/* {type === "dir" && (
          <div style={{ border: `1px solid gray`, marginBottom: "5px" }}></div>
        )} */}
        {files && <div>{files.map((file) => renderDirs(file))}</div>}
      </>
    );
  };

  return (
    <div className="App">
      <div className="leftMenu">{dirs && renderDirs(dirs)}</div>
      <div className="main"></div>
    </div>
  );
};

export default App;
