import type { AdminUser } from '../types/admin.types';

interface UsersTableProps {
  users: AdminUser[];
  isLoading: boolean;
  currentUserId: string;
  onView: (user: AdminUser) => void;
  onStatusChange: (user: AdminUser) => void;
}

function initials(name: string) { return name.split(' ').slice(0, 2).map((part) => part[0]).join('').toUpperCase(); }
function date(value?: string) { return value ? new Intl.DateTimeFormat('en', { dateStyle: 'medium' }).format(new Date(value)) : 'Never'; }

export function UsersTable({ users, isLoading, currentUserId, onView, onStatusChange }: UsersTableProps) {
  if (isLoading) return <div className="admin-table admin-table--loading">{[1, 2, 3, 4, 5].map((item) => <div key={item} />)}</div>;
  if (!users.length) return <div className="admin-empty"><span>⌕</span><h3>No users found</h3><p>Try changing the current search or filters.</p></div>;

  return (
    <div className="admin-table-wrap">
      <table className="admin-table">
        <thead><tr><th>User</th><th>Role</th><th>Status</th><th>Last login</th><th>Joined</th><th><span className="sr-only">Actions</span></th></tr></thead>
        <tbody>{users.map((user) => <tr key={user._id}><td><div className="admin-user-cell"><span>{initials(user.name)}</span><div><strong>{user.name}</strong><small>{user.email}</small></div></div></td><td><span className={`admin-role admin-role--${user.role}`}>{user.role}</span></td><td><span className={`admin-status admin-status--${user.isActive ? 'active' : 'inactive'}`}><i />{user.isActive ? 'Active' : 'Inactive'}</span></td><td>{date(user.lastLoginAt)}</td><td>{date(user.createdAt)}</td><td><div className="admin-row-actions"><button type="button" onClick={() => onView(user)}>View</button><button type="button" disabled={user._id === currentUserId} onClick={() => onStatusChange(user)}>{user.isActive ? 'Deactivate' : 'Activate'}</button></div></td></tr>)}</tbody>
      </table>
    </div>
  );
}
