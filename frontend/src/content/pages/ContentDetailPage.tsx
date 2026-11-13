import { useEffect, useMemo, useState } from 'react';

import { WorkspaceShell } from '../../dashboard/components/WorkspaceShell';
import { DeleteDialog } from '../components/DeleteDialog';
import { deleteContent, getContentById, getContentRevisions, updateContent } from '../services/contentApi';
import type { ContentGeneration, RevisionHistory } from '../types/content.types';
import { navigate } from '../../routing/router';

interface ContentDetailPageProps { contentId: string; }

function downloadContent(title: string, content: string) {
  const url = URL.createObjectURL(new Blob([`# ${title}\n\n${content}`], { type: 'text/markdown' }));
  const link = document.createElement('a'); link.href = url; link.download = `${title || 'content'}.md`; link.click(); URL.revokeObjectURL(url);
}

export function ContentDetailPage({ contentId }: ContentDetailPageProps) {
  const [generation, setGeneration] = useState<ContentGeneration | null>(null);
  const [revisions, setRevisions] = useState<RevisionHistory | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const loadContent = async () => {
    setIsLoading(true); setError('');
    try {
      const [item, versionData] = await Promise.all([getContentById(contentId), getContentRevisions(contentId)]);
      setGeneration(item); setRevisions(versionData); setTitle(item.title); setContent(item.generatedContent);
    } catch (loadError) { setError(loadError instanceof Error ? loadError.message : 'Unable to load content.'); }
    finally { setIsLoading(false); }
  };

  useEffect(() => { void loadContent(); }, [contentId]);
  const wordCount = useMemo(() => content.trim() ? content.trim().split(/\s+/).length : 0, [content]);

  const save = async () => {
    if (!generation || !title.trim() || !content.trim()) return;
    setIsSaving(true); setMessage('');
    try {
      const updated = await updateContent(contentId, { title: title.trim(), generatedContent: content });
      setGeneration(updated); setRevisions(await getContentRevisions(contentId)); setMessage('Saved. Your previous content was added to revision history.');
    } catch (saveError) { setMessage(saveError instanceof Error ? saveError.message : 'Unable to save changes.'); }
    finally { setIsSaving(false); }
  };

  const remove = async () => {
    setIsDeleting(true);
    try { await deleteContent(contentId); navigate('/content', { replace: true }); }
    catch (deleteError) { setError(deleteError instanceof Error ? deleteError.message : 'Unable to delete content.'); setShowDelete(false); setIsDeleting(false); }
  };

  return (
    <WorkspaceShell activePage="content" headerTitle="Content Editor" headerSubtitle="Edit and manage your saved generation" actionHref="/studio" actionLabel="New content">
      {() => (
        <main className="content-detail-page">
          <a className="content-back" href="/content">← Back to my content</a>
          {isLoading && <div className="detail-loading">Loading your content…</div>}
          {error && <div className="studio-alert" role="alert"><span>!</span>{error}</div>}
          {!isLoading && generation && (
            <div className="detail-layout">
              <section className="detail-editor-card">
                <div className="detail-editor-card__top"><div><span className={`recent-item__status recent-item__status--${generation.status}`}>{generation.status}</span><small>{generation.model || generation.provider}</small></div><div><button type="button" onClick={() => void navigator.clipboard.writeText(content)}>Copy</button><button type="button" onClick={() => downloadContent(title, content)}>Export</button><button className="detail-delete" type="button" onClick={() => setShowDelete(true)}>Delete</button></div></div>
                <input className="detail-title" value={title} onChange={(event) => setTitle(event.target.value)} maxLength={150} aria-label="Content title" />
                <textarea className="detail-editor" value={content} onChange={(event) => setContent(event.target.value)} aria-label="Content editor" />
                <div className="detail-editor-card__footer"><div><span>{wordCount} words</span><span>{content.length} characters</span></div><button type="button" onClick={() => void save()} disabled={isSaving || generation.status !== 'completed'}>{isSaving ? 'Saving…' : 'Save changes'}</button></div>
                {message && <p className="result-message">{message}</p>}
              </section>
              <aside className="detail-sidebar">
                <section><h2>Original request</h2><dl><div><dt>Topic</dt><dd>{generation.input.topic}</dd></div><div><dt>Tone</dt><dd>{generation.input.tone}</dd></div><div><dt>Language</dt><dd>{generation.input.customLanguage || generation.input.language}</dd></div>{generation.input.targetAudience && <div><dt>Audience</dt><dd>{generation.input.targetAudience}</dd></div>}<div><dt>Description</dt><dd>{generation.input.description}</dd></div></dl></section>
                <section><h2>Revision history</h2><p className="detail-sidebar__hint">Load an earlier version into the editor, then save to make it current.</p><div className="revision-list">{revisions?.revisions.length ? [...revisions.revisions].reverse().map((revision) => <button type="button" key={revision.version} onClick={() => { setContent(revision.content); setMessage(`Version ${revision.version} loaded. Save to apply it.`); }}><span>Version {revision.version}</span><time>{new Intl.DateTimeFormat('en', { dateStyle: 'medium' }).format(new Date(revision.createdAt))}</time></button>) : <small>No previous revisions yet.</small>}</div></section>
              </aside>
            </div>
          )}
          {showDelete && generation && <DeleteDialog title={generation.title} isDeleting={isDeleting} onCancel={() => setShowDelete(false)} onConfirm={() => void remove()} />}
        </main>
      )}
    </WorkspaceShell>
  );
}
