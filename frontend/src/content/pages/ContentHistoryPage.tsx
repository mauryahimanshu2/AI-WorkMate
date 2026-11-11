import { useCallback, useEffect, useState } from 'react';

import { WorkspaceShell } from '../../dashboard/components/WorkspaceShell';
import { DeleteDialog } from '../components/DeleteDialog';
import { HistoryFilters } from '../components/HistoryFilters';
import { HistoryList } from '../components/HistoryList';
import { deleteContent, getContentHistory, getContentTypes } from '../services/contentApi';
import type { ContentHistoryItem, ContentStatus, ContentType } from '../types/content.types';

export function ContentHistoryPage() {
  const [items, setItems] = useState<ContentHistoryItem[]>([]);
  const [contentTypes, setContentTypes] = useState<ContentType[]>([]);
  const [search, setSearch] = useState('');
  const [contentType, setContentType] = useState('');
  const [status, setStatus] = useState('');
  const [applied, setApplied] = useState({ search: '', contentType: '', status: '' });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteTarget, setDeleteTarget] = useState<ContentHistoryItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadHistory = useCallback(async () => {
    setIsLoading(true); setError('');
    try {
      const data = await getContentHistory({ page, limit: 9, search: applied.search || undefined, contentType: applied.contentType || undefined, status: applied.status as ContentStatus | '' });
      setItems(data.history); setTotalPages(Math.max(1, data.pagination.totalPages)); setTotalRecords(data.pagination.totalRecords);
    } catch (loadError) { setError(loadError instanceof Error ? loadError.message : 'Unable to load content.'); }
    finally { setIsLoading(false); }
  }, [applied, page]);

  useEffect(() => { void getContentTypes().then(setContentTypes).catch(() => undefined); }, []);
  useEffect(() => { void loadHistory(); }, [loadHistory]);

  const applyFilters = () => { setPage(1); setApplied({ search: search.trim(), contentType, status }); };
  const clearFilters = () => { setSearch(''); setContentType(''); setStatus(''); setPage(1); setApplied({ search: '', contentType: '', status: '' }); };
  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try { await deleteContent(deleteTarget._id); setDeleteTarget(null); await loadHistory(); }
    catch (deleteError) { setError(deleteError instanceof Error ? deleteError.message : 'Unable to delete content.'); }
    finally { setIsDeleting(false); }
  };

  return (
    <WorkspaceShell activePage="content" headerTitle="My Content" headerSubtitle={`${totalRecords} saved generations`} actionHref="/studio" actionLabel="New content">
      {() => (
        <main className="content-history-page">
          <div className="content-page-heading"><div><p>Your library</p><h1>All your content, in one place.</h1><span>Search, filter, open, edit, and manage every saved generation.</span></div></div>
          <HistoryFilters search={search} contentType={contentType} status={status} contentTypes={contentTypes} onSearchChange={setSearch} onContentTypeChange={setContentType} onStatusChange={setStatus} onApply={applyFilters} onClear={clearFilters} />
          {error && <div className="studio-alert" role="alert"><span>!</span>{error}</div>}
          <HistoryList items={items} isLoading={isLoading} onDelete={setDeleteTarget} />
          {!isLoading && totalPages > 1 && <nav className="history-pagination" aria-label="History pages"><button type="button" disabled={page === 1} onClick={() => setPage((current) => current - 1)}>← Previous</button><span>Page {page} of {totalPages}</span><button type="button" disabled={page === totalPages} onClick={() => setPage((current) => current + 1)}>Next →</button></nav>}
          {deleteTarget && <DeleteDialog title={deleteTarget.title} isDeleting={isDeleting} onCancel={() => setDeleteTarget(null)} onConfirm={() => void confirmDelete()} />}
        </main>
      )}
    </WorkspaceShell>
  );
}
