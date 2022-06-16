import React, { useEffect, useState } from "react";
import ApiMongo from "../js/ApiMongo";
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
  let [uploadStatus, setUploadStatus] = useState(false);
  let [file, setFile] = useState(null);

  useEffect(() => {}, [visible, uploadStatus]);

  function handleDialogHide() {
    console.log("hide");
    if (!uploadStatus) {
      setDialogVisible(false);
    }
  }

  function handleChange(e: any) {
    let f = e.target.files[0];

    setFile(f);
  }

  async function handleUpload() {
    if (!uploadStatus && file != null) {
      let f = file as File;

      setUploadStatus(true);
      await setOwnTaskList(await f.text(), setLocalTasks);
      setUploadStatus(false);

      handleDialogHide();
    } else if (!uploadStatus && file == null) {
      ApiMongo.showWarning("Please set File");
    }
  }

  if (visible) {
    return (
      <div className="dialog-wrapper">
        <div className="upload-dialog">
          <div className="upload-head">
            <p> Please upload your compatible todolist file.</p>
            <button onClick={handleDialogHide}> X </button>
          </div>
          <div className="upload-box">
            <input type="file" onChange={handleChange} accept=".tl"></input>
            <p> Note: this will remove all existing tasks!</p>
            <button type="submit" onClick={handleUpload}>
              {uploadStatus ? "UPLOADING.." : "UPLOAD"}
            </button>
          </div>
        </div>
      </div>
    );
  } else {
    return <></>;
  }
}
