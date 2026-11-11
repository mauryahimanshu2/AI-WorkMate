import { useEffect, useState, type FormEvent } from 'react';

import type { ContentOptions, ContentType, GenerationInput } from '../types/content.types';

interface GenerationFormProps {
  selectedType: ContentType;
  options: ContentOptions;
  isGenerating: boolean;
  onGenerate: (input: GenerationInput) => Promise<void>;
}

interface FormValues {
  topic: string; description: string; targetAudience: string; tone: string;
  language: string; customLanguage: string; wordCount: string; keywords: string;
  additionalInstructions: string; recipient: string; platform: string;
  callToAction: string; productName: string; features: string; benefits: string;
  outlinePreference: boolean;
}

const initialValues: FormValues = {
  topic: '', description: '', targetAudience: '', tone: 'professional', language: 'English',
  customLanguage: '', wordCount: '', keywords: '', additionalInstructions: '', recipient: '',
  platform: 'LinkedIn', callToAction: '', productName: '', features: '', benefits: '',
  outlinePreference: false,
};

const optional = (value: string) => value.trim() || undefined;
const list = (value: string) => value.split(',').map((item) => item.trim()).filter(Boolean);

export function GenerationForm({ selectedType, options, isGenerating, onGenerate }: GenerationFormProps) {
  const [values, setValues] = useState<FormValues>(initialValues);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    setErrors({});
  }, [selectedType.id]);

  const update = <K extends keyof FormValues>(key: K, value: FormValues[K]) => {
    setValues((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: '' }));
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const nextErrors: Record<string, string> = {};
    if (values.topic.trim().length < 3) nextErrors.topic = 'Use at least 3 characters.';
    if (values.description.trim().length < 10) nextErrors.description = 'Use at least 10 characters.';
    if (values.language === 'Custom' && !values.customLanguage.trim()) nextErrors.customLanguage = 'Enter a language.';
    const wordCount = values.wordCount ? Number(values.wordCount) : undefined;
    if (wordCount && (wordCount < 50 || wordCount > 5000)) nextErrors.wordCount = 'Use 50–5,000 words.';
    if (list(values.keywords).length > options.maximumKeywords) nextErrors.keywords = `Use no more than ${options.maximumKeywords} keywords.`;

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    await onGenerate({
      contentType: selectedType.id,
      topic: values.topic.trim(),
      description: values.description.trim(),
      targetAudience: optional(values.targetAudience),
      tone: values.tone,
      language: values.language,
      customLanguage: optional(values.customLanguage),
      wordCount,
      keywords: list(values.keywords),
      additionalInstructions: optional(values.additionalInstructions),
      recipient: optional(values.recipient),
      platform: selectedType.dynamicFields.includes('platform') ? values.platform : undefined,
      callToAction: optional(values.callToAction),
      productName: optional(values.productName),
      features: list(values.features),
      benefits: list(values.benefits),
      outlinePreference: selectedType.dynamicFields.includes('outlinePreference') ? values.outlinePreference : undefined,
    });
  };

  const field = (id: keyof FormValues, label: string, placeholder: string, maxLength?: number) => (
    <label className="studio-field" htmlFor={`generation-${id}`}>
      <span>{label}</span>
      <input id={`generation-${id}`} value={String(values[id])} onChange={(event) => update(id, event.target.value as never)} placeholder={placeholder} maxLength={maxLength} />
      {errors[id] && <small>{errors[id]}</small>}
    </label>
  );

  return (
    <form className="generation-form" onSubmit={handleSubmit} noValidate>
      <div className="studio-form-heading"><span>Step 2</span><div><h2>Describe what you need</h2><p>The more useful context you add, the stronger your first draft will be.</p></div></div>
      {field('topic', 'Topic or subject *', 'For example: Project status update', 150)}
      <label className="studio-field" htmlFor="generation-description">
        <span>Description *</span>
        <textarea id="generation-description" rows={5} value={values.description} onChange={(event) => update('description', event.target.value)} placeholder="Explain the purpose, key context, and information the draft should include." maxLength={5000} />
        <div className="studio-field__meta">{errors.description && <small>{errors.description}</small>}<em>{values.description.length}/5000</em></div>
      </label>
      <div className="studio-form-grid">
        {field('targetAudience', 'Target audience', 'Who is this for?')}
        {field('wordCount', 'Approximate words', 'Optional')}
        <label className="studio-field"><span>Tone *</span><select value={values.tone} onChange={(event) => update('tone', event.target.value)}>{options.tones.map((tone) => <option key={tone} value={tone}>{tone[0].toUpperCase() + tone.slice(1)}</option>)}</select></label>
        <label className="studio-field"><span>Language *</span><select value={values.language} onChange={(event) => update('language', event.target.value)}>{options.languages.map((language) => <option key={language}>{language}</option>)}</select></label>
      </div>
      {values.language === 'Custom' && field('customLanguage', 'Custom language *', 'Enter the language')}
      {selectedType.dynamicFields.includes('recipient') && field('recipient', 'Recipient', 'Recipient name or role')}
      {selectedType.dynamicFields.includes('platform') && <label className="studio-field"><span>Platform</span><select value={values.platform} onChange={(event) => update('platform', event.target.value)}>{options.socialPlatforms.map((platform) => <option key={platform}>{platform}</option>)}</select></label>}
      {selectedType.dynamicFields.includes('productName') && field('productName', 'Product name', 'Name of the product')}
      {selectedType.dynamicFields.includes('features') && field('features', 'Features', 'Comma-separated features')}
      {selectedType.dynamicFields.includes('benefits') && field('benefits', 'Benefits', 'Comma-separated benefits')}
      {selectedType.dynamicFields.includes('callToAction') && field('callToAction', 'Call to action', 'What should the reader do next?')}
      {selectedType.dynamicFields.includes('keywords') && field('keywords', 'Keywords', 'Comma-separated keywords')}
      {selectedType.dynamicFields.includes('outlinePreference') && <label className="studio-checkbox"><input type="checkbox" checked={values.outlinePreference} onChange={(event) => update('outlinePreference', event.target.checked)} /><span>Include an outline before the article</span></label>}
      <label className="studio-field" htmlFor="generation-instructions"><span>Additional instructions</span><textarea id="generation-instructions" rows={3} value={values.additionalInstructions} onChange={(event) => update('additionalInstructions', event.target.value)} placeholder="Optional constraints, details, or style guidance." maxLength={2000} /></label>
      <button className="generation-submit" type="submit" disabled={isGenerating}>{isGenerating ? <><span className="button-spinner" />Creating your draft…</> : <>Generate content <span aria-hidden="true">✦</span></>}</button>
    </form>
  );
}
