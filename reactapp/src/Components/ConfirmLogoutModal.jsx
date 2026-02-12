import React, { useEffect } from "react";

const ConfirmLogoutModal = ({ open, onConfirm, onCancel }) => {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onCancel?.();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onCancel]);

  if (!open) return null;

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true">
      <div className="modal-box">
        <div className="d-flex align-items-start justify-content-between">
          <h5 className="modal-title">Are you sure you want to logout?</h5>
          <span className="badge-pulse ms-2"></span>
        </div>
        <div className="modal-actions mt-3">
          <button className="btn btn-yes" onClick={onConfirm}>Yes, Logout</button>
          <button className="btn btn-cancel" onClick={onCancel}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmLogoutModal;
