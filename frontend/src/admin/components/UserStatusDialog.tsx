import type { AdminUser } from '../types/admin.types';

interface UserStatusDialogProps {
  user: AdminUser;
  isUpdating: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export function UserStatusDialog({ user, isUpdating, onCancel, onConfirm }: UserStatusDialogProps) {
  const action = user.isActive ? 'Deactivate' : 'Activate';
  return (
    <div className="admin-dialog-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) onCancel(); }}>
      <section className="admin-dialog" role="dialog" aria-modal="true" aria-labelledby="status-dialog-title">
        <span className={user.isActive ? 'admin-dialog__icon admin-dialog__icon--warning' : 'admin-dialog__icon'}>{user.isActive ? '!' : '✓'}</span>
        <h2 id="status-dialog-title">{action} this account?</h2>
        <p>{user.isActive ? `${user.name} will be signed out and unable to access AI WorkMate.` : `${user.name} will regain access to AI WorkMate.`}</p>
        <div><button type="button" onClick={onCancel} disabled={isUpdating}>Cancel</button><button className={user.isActive ? 'admin-dialog__danger' : 'admin-dialog__confirm'} type="button" onClick={onConfirm} disabled={isUpdating}>{isUpdating ? 'Updating…' : action}</button></div>
      </section>
    </div>
  );
}
