import React, { useEffect, useState } from "react";

const App = () => {
  const [data, setData] = useState();
  useEffect(() => {
    window.api.send("toMain", { type: "GET_DIRS" });
    window.api.receive("fromMain", (data) => {
      setData(data);
    });
  }, []);
  return (
    <div className="App">
      <div className="leftMenu">메뉴</div>
      <div className="main"></div>
    </div>
  );
};

export default App;
