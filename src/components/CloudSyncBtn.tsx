import React, { useState } from "react";

export default function CloudSyncBtn({
  setLocalTasks,
  ApiSaveCloudFn,
}: {
  setLocalTasks: Function;
  ApiSaveCloudFn: Function;
}) {
  let [btnText, setBtnText] = useState("Sync");

  async function save() {
    setBtnText("Syncing..");
    const returnedTasks = await ApiSaveCloudFn();
    setBtnText("Sync");

    setLocalTasks(returnedTasks);
  }

  return (
    <button className="filter-button" onClick={save}>
      {btnText}
    </button>
  );
}
