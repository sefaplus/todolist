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
  let [visible, setVisible] = useState(false);
  useEffect(() => {
    setVisible(true);
  }, [errorText]);
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
