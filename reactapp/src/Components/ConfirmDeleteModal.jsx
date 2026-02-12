import React, { useEffect } from "react";

const ConfirmDeleteModal = ({
  open,
  onConfirm,
  onCancel,
  title = "Are you sure you want to delete this book?",
}) => {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onCancel?.();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onCancel]);

  if (!open) return null;

  return (
    <div className="mini-modal-backdrop" role="dialog" aria-modal="true">
      <div className="mini-modal-box">
        <div className="mini-modal-body">{title}</div>
        <div className="mini-modal-actions">
          <button className="mini-btn-danger" onClick={onConfirm}>Yes, Delete</button>
          <button className="mini-btn-cancel" onClick={onCancel}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDeleteModal;
