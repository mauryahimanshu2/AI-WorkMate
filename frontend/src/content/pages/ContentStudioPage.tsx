import { useEffect, useMemo, useState } from 'react';

import { WorkspaceShell } from '../../dashboard/components/WorkspaceShell';
import { ContentTypePicker } from '../components/ContentTypePicker';
import { GeneratedResult } from '../components/GeneratedResult';
import { GenerationForm } from '../components/GenerationForm';
import { generateContent, getContentOptions, getContentTypes } from '../services/contentApi';
import type { ContentOptions, ContentType, GeneratedContent, GenerationInput } from '../types/content.types';

export function ContentStudioPage() {
  const requestedType = new URLSearchParams(window.location.search).get('type');
  const [contentTypes, setContentTypes] = useState<ContentType[]>([]);
  const [options, setOptions] = useState<ContentOptions | null>(null);
  const [selectedId, setSelectedId] = useState(requestedType || '');
  const [result, setResult] = useState<GeneratedContent | null>(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    Promise.all([getContentTypes(), getContentOptions()])
      .then(([types, contentOptions]) => {
        setContentTypes(types);
        setOptions(contentOptions);
        setSelectedId((current) => types.some((type) => type.id === current) ? current : types[0]?.id || '');
      })
      .catch((loadError) => setError(loadError instanceof Error ? loadError.message : 'Unable to load the studio.'))
      .finally(() => setIsLoading(false));
  }, []);

  const selectedType = useMemo(
    () => contentTypes.find((type) => type.id === selectedId),
    [contentTypes, selectedId],
  );

  const handleGenerate = async (input: GenerationInput) => {
    setIsGenerating(true);
    setError('');
    setResult(null);
    try {
      setResult(await generateContent(input));
    } catch (generationError) {
      setError(generationError instanceof Error ? generationError.message : 'Unable to generate content.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <WorkspaceShell activePage="studio" headerTitle="Content Studio" headerSubtitle="Create a focused first draft" actionHref="/content" actionLabel="My content">
      {() => (
        <main className="studio-page">
          <section className="studio-intro"><div><p>AI Content Studio</p><h1>Create content with clear direction.</h1><span>Choose a format, add the context that matters, and keep full control of the result.</span></div><div className="studio-intro__badge"><span>✦</span><div><strong>Secure generation</strong><small>Your API key stays on the backend</small></div></div></section>
          {error && <div className="studio-alert" role="alert"><span>!</span>{error}</div>}
          {isLoading && <div className="studio-loading">Loading content options…</div>}
          {!isLoading && selectedType && options && (
            <>
              <section className="studio-step"><div className="studio-step__heading"><span>Step 1</span><div><h2>Choose a content type</h2><p>Each format uses instructions designed for that specific job.</p></div></div><ContentTypePicker contentTypes={contentTypes} selectedId={selectedId} onSelect={(id) => { setSelectedId(id); setResult(null); }} /></section>
              <div className="studio-workspace"><GenerationForm selectedType={selectedType} options={options} isGenerating={isGenerating} onGenerate={handleGenerate} /><GeneratedResult result={result} isGenerating={isGenerating} /></div>
            </>
          )}
        </main>
      )}
    </WorkspaceShell>
  );
}
