import type { ContentType } from '../types/content.types';

interface ContentTypePickerProps {
  contentTypes: ContentType[];
  selectedId: string;
  onSelect: (id: string) => void;
}

const icons: Record<string, string> = {
  professional_email: '✉', social_media_post: '#', blog_article: '▤',
  blog_outline: '⌁', product_description: '◇', marketing_copy: '↗',
  business_proposal: '▣', job_description: '◉', meeting_summary: '✓', custom_content: '+',
};

export function ContentTypePicker({ contentTypes, selectedId, onSelect }: ContentTypePickerProps) {
  return (
    <div className="studio-types" role="list" aria-label="Content types">
      {contentTypes.map((type) => (
        <button
          className={`studio-type ${selectedId === type.id ? 'studio-type--active' : ''}`}
          type="button"
          key={type.id}
          onClick={() => onSelect(type.id)}
          aria-pressed={selectedId === type.id}
        >
          <span aria-hidden="true">{icons[type.id] || '◇'}</span>
          <div><strong>{type.name}</strong><small>{type.description}</small></div>
        </button>
      ))}
    </div>
  );
}
