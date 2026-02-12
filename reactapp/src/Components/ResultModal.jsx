import React, { useEffect } from "react";

const ResultModal = ({ open, message = "Success", onClose, okText = "Close" }) => {
  // close on ESC
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose?.();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  // hidden when not open
  if (!open) return null;

  return (
    <div className="mini-modal-backdrop" role="dialog" aria-modal="true">
      <div className="mini-modal-box">
        <div className="mini-modal-body">{message}</div>
        <div className="mini-modal-actions">
          <button className="mini-btn-close" onClick={onClose}>{okText}</button>
        </div>
      </div>
    </div>
  );
};

export default ResultModal;
