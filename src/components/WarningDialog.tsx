import React, { useEffect, useState } from "react";

export default function WarningDialog({
  errorText,
  warningVisible,
  setWarningVisible,
}: {
  errorText: string;
  warningVisible: boolean;
  setWarningVisible: Function;
}) {
  useEffect(() => {}, [errorText, warningVisible]);
  function hide(e: React.MouseEvent) {
    setWarningVisible(false);
  }
  if (warningVisible) {
    return (
      <div className="warning-wrapper">
        <div className="warning-dialog">
          <p> {errorText} </p>
          <button onClick={hide}> OK </button>
        </div>
      </div>
    );
  } else {
    return <></>;
  }
}
