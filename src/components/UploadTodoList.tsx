import React, { useEffect } from "react";
export default function UploadDialog({
  visible,
  setDialogVisible,
  setOwnTaskList,
  setLocalTasks,
}: {
  visible: boolean;
  setDialogVisible: Function;
  setOwnTaskList: Function;
  setLocalTasks: Function;
}) {
  useEffect(() => {}, [visible]);
  function handleDialogHide() {
    console.log("hide");
    setDialogVisible(false);
  }
  async function handleChange(e: any) {
    let f = e.target.files[0];
    setOwnTaskList(await f.text(), setLocalTasks);
    handleDialogHide();
  }
  if (visible) {
    return (
      <div className="dialog-wrapper">
        <div className="upload-dialog">
          <div className="upload-head">
            <p> Please upload your compatible todolist file.</p>
            <p> Not this will remove all existing tasks!</p>
            <button onClick={handleDialogHide}> X </button>
          </div>
          <div className="upload-box">
            <input type="file" accept=".tl" onChange={handleChange}></input>
            <button type="submit"> UPLOAD </button>
          </div>
        </div>
      </div>
    );
  } else {
    return <></>;
  }
}
