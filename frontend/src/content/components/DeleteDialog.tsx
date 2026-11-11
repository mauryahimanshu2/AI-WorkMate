interface DeleteDialogProps {
  title: string;
  isDeleting: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export function DeleteDialog({ title, isDeleting, onCancel, onConfirm }: DeleteDialogProps) {
  return (
    <div className="dialog-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onCancel(); }}>
      <section className="delete-dialog" role="dialog" aria-modal="true" aria-labelledby="delete-title">
        <span className="delete-dialog__icon" aria-hidden="true">!</span>
        <h2 id="delete-title">Delete this content?</h2>
        <p>“{title}” and its revision history will be permanently removed.</p>
        <div><button type="button" onClick={onCancel} disabled={isDeleting}>Cancel</button><button className="delete-dialog__confirm" type="button" onClick={onConfirm} disabled={isDeleting}>{isDeleting ? 'Deleting…' : 'Delete content'}</button></div>
      </section>
    </div>
  );
}
