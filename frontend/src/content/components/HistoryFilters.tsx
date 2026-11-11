import type { FormEvent } from 'react';

import type { ContentType } from '../types/content.types';

interface HistoryFiltersProps {
  search: string;
  contentType: string;
  status: string;
  contentTypes: ContentType[];
  onSearchChange: (value: string) => void;
  onContentTypeChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onApply: () => void;
  onClear: () => void;
}

export function HistoryFilters(props: HistoryFiltersProps) {
  const submit = (event: FormEvent) => { event.preventDefault(); props.onApply(); };

  return (
    <form className="history-filters" onSubmit={submit}>
      <label><span className="sr-only">Search by title</span><input type="search" value={props.search} onChange={(event) => props.onSearchChange(event.target.value)} placeholder="Search by title" maxLength={100} /></label>
      <label><span className="sr-only">Content type</span><select value={props.contentType} onChange={(event) => props.onContentTypeChange(event.target.value)}><option value="">All content types</option>{props.contentTypes.map((type) => <option value={type.id} key={type.id}>{type.name}</option>)}</select></label>
      <label><span className="sr-only">Status</span><select value={props.status} onChange={(event) => props.onStatusChange(event.target.value)}><option value="">All statuses</option><option value="completed">Completed</option><option value="pending">Pending</option><option value="failed">Failed</option></select></label>
      <button type="submit">Apply filters</button>
      <button className="history-filters__clear" type="button" onClick={props.onClear}>Clear</button>
    </form>
  );
}
