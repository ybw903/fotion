import { useCallback, useState } from "react";
import "./App.css";
import Splash from "./componets/Splash";
import Main from "./Main";

const App = () => {
  const [workspace, setWorkspace] = useState("");
  const [showSplash, setShowSplash] = useState(true);

  const handleChangeWorkspace = useCallback((workspace: string) => {
    console.log(workspace);
    setWorkspace(workspace);
  }, []);

  const handleChangeSplash = useCallback(() => {
    setShowSplash((prev) => !prev);
  }, []);

  return (
    <div className={showSplash ? "App-splash" : "App"}>
      {showSplash && (
        <Splash
          workspace={workspace}
          handleShowOffSplash={handleChangeSplash}
          handleChangeWorkSpace={handleChangeWorkspace}
        />
      )}
      {!showSplash && <Main workspace={workspace} />}
    </div>
  );
};

export default App;
