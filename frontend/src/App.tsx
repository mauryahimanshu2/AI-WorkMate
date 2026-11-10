import { reset, setSelectedContentType } from './features/aiContent/aiContentSlice';
import { useAppDispatch, useAppSelector } from './store/hooks';

const contentTypes = [
  'professional_email',
  'social_media_post',
  'blog_article',
  'product_description',
];

function App() {
  const dispatch = useAppDispatch();
  const selectedContentType = useAppSelector(
    (state) => state.aiContent.selectedContentType,
  );

  return (
    <main className="app-shell">
      <section className="card">
        <p className="eyebrow">AI WorkMate</p>
        <h1>Content Studio</h1>
        <p>React, TypeScript, and Redux Toolkit are ready.</p>

        <label htmlFor="content-type">Content type</label>
        <select
          id="content-type"
          value={selectedContentType ?? ''}
          onChange={(event) =>
            dispatch(setSelectedContentType(event.target.value || null))
          }
        >
          <option value="">Select a type</option>
          {contentTypes.map((contentType) => (
            <option key={contentType} value={contentType}>
              {contentType.replaceAll('_', ' ')}
            </option>
          ))}
        </select>

        <button type="button" onClick={() => dispatch(reset())}>
          Reset Redux state
        </button>
      </section>
    </main>
  );
}

export default App;

