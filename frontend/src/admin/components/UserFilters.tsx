import type { FormEvent } from 'react';

interface UserFiltersProps {
  search: string;
  status: string;
  role: string;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onRoleChange: (value: string) => void;
  onApply: () => void;
  onClear: () => void;
}

export function UserFilters(props: UserFiltersProps) {
  const submit = (event: FormEvent) => { event.preventDefault(); props.onApply(); };
  return (
    <form className="admin-filters" onSubmit={submit}>
      <label className="admin-search"><span>⌕</span><input type="search" value={props.search} onChange={(event) => props.onSearchChange(event.target.value)} placeholder="Search name or email" maxLength={100} /></label>
      <select value={props.status} onChange={(event) => props.onStatusChange(event.target.value)} aria-label="Filter by status"><option value="">All statuses</option><option value="active">Active</option><option value="inactive">Inactive</option></select>
      <select value={props.role} onChange={(event) => props.onRoleChange(event.target.value)} aria-label="Filter by role"><option value="">All roles</option><option value="user">Users</option><option value="admin">Administrators</option></select>
      <button type="submit">Apply</button><button className="admin-filters__clear" type="button" onClick={props.onClear}>Clear</button>
    </form>
  );
}
