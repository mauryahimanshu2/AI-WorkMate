import { useEffect, useMemo, useState } from 'react';

import { updateContent } from '../services/contentApi';
import type { GeneratedContent } from '../types/content.types';

interface GeneratedResultProps {
  result: GeneratedContent | null;
  isGenerating: boolean;
}

function downloadText(filename: string, content: string, type: string) {
  const url = URL.createObjectURL(new Blob([content], { type }));
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

export function GeneratedResult({ result, isGenerating }: GeneratedResultProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [message, setMessage] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setTitle(result?.title || '');
    setContent(result?.generatedContent || '');
    setMessage('');
  }, [result]);

  const wordCount = useMemo(() => content.trim() ? content.trim().split(/\s+/).length : 0, [content]);

  const copyContent = async () => {
    await navigator.clipboard.writeText(content);
    setMessage('Copied to clipboard.');
  };

  const saveChanges = async () => {
    if (!result || !title.trim() || !content.trim()) return;
    setIsSaving(true);
    setMessage('');
    try {
      await updateContent(result.id, { title: title.trim(), generatedContent: content });
      setMessage('Changes saved. The previous content is available in revisions.');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Unable to save changes.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isGenerating) {
    return (
      <section className="result-panel result-panel--loading">
        <div className="result-loader"><span>✦</span><h2>Creating your draft</h2><p>The AI provider is working with your instructions.</p><div><i /><i /><i /></div></div>
      </section>
    );
  }

  if (!result) {
    return (
      <section className="result-panel result-panel--empty">
        <div><span aria-hidden="true">✦</span><h2>Your draft will appear here</h2><p>Choose a content type, complete the form, and generate your first draft.</p></div>
      </section>
    );
  }

  return (
    <section className="result-panel">
      <div className="result-panel__toolbar">
        <div><span className="result-status">Completed</span><small>{result.model || result.provider}</small></div>
        <div className="result-actions">
          <button type="button" onClick={() => void copyContent()}>Copy</button>
          <button type="button" onClick={() => downloadText(`${title || 'content'}.txt`, content, 'text/plain')}>TXT</button>
          <button type="button" onClick={() => downloadText(`${title || 'content'}.md`, `# ${title}\n\n${content}`, 'text/markdown')}>Markdown</button>
        </div>
      </div>
      <input className="result-title" value={title} onChange={(event) => setTitle(event.target.value)} aria-label="Content title" maxLength={150} />
      <textarea className="result-editor" value={content} onChange={(event) => setContent(event.target.value)} aria-label="Generated content" />
      <div className="result-panel__footer">
        <div><span>{wordCount} words</span><span>{content.length} characters</span><span>{result.usage.totalTokens || result.usage.inputTokens + result.usage.outputTokens} tokens</span></div>
        <button type="button" onClick={() => void saveChanges()} disabled={isSaving}>{isSaving ? 'Saving…' : 'Save changes'}</button>
      </div>
      {message && <p className="result-message" role="status">{message}</p>}
    </section>
  );
}
