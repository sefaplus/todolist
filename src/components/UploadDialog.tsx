import React, { useEffect, useState } from "react";
import ApiMongo from "../ts/ApiMongo";
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
    if (!uploadStatus) {
      setDialogVisible(false);
    }
  }

  function handleChange(e: any) {
    setFile(e.target.files[0]);
  }

  async function handleUpload() {
    if (!uploadStatus && file) {
      let f = file as File;
      await setOwnTaskList(await f.text(), setLocalTasks, setUploadStatus);

      return handleDialogHide();
    }

    ApiMongo.showWarning("Please set File");
  }

  return visible ? (
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
  ) : (
    <></>
  );
}
