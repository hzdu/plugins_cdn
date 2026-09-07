const { render, useState, useCallback, useEffect } = wp.element;
import { NekoInput, NekoButton } from '@neko-ui';
import AiIcon from '@app/styles/AiIcon';

// Inject only the CSS variables NekoInput/NekoButton need (avoids importing full NekoUI)
const NEKO_CSS_VARS = `:root {
  --neko-blue: hsl(204.25deg 100% 36.47%);
  --neko-main-color: var(--neko-blue);
  --neko-main-color-50: hsl(206deg 61.04% 54.71%);
  --neko-main-color-disabled: var(--neko-main-color-50);
  --neko-secondary: hsl(206 100% 96%);
  --neko-gray-30: hsl(210 11% 26%);
  --neko-gray-90: hsl(210 16% 92%);
  --neko-gray-95: hsl(210 20% 96%);
  --neko-gray-98: hsl(210 25% 98%);
  --neko-font-size: 13px;
  --neko-font-color: var(--neko-gray-30);
  --neko-radius-sm: 6px;
  --neko-radius-md: 8px;
  --neko-shadow-xs: 0 1px 2px rgba(16, 24, 40, 0.06);
  --neko-focus-ring: 0 0 0 3px color-mix(in oklab, var(--neko-main-color) 25%, transparent);
  --neko-input-background: var(--neko-gray-98);
  --neko-input-border: var(--neko-gray-90);
}`;

const LibrarySearch = () => {
  const params = new URLSearchParams(window.location.search);
  const initialQuery = params.get('mwai_library_search') || '';
  const [query, setQuery] = useState(initialQuery);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!document.getElementById('mwai-neko-vars')) {
      const style = document.createElement('style');
      style.id = 'mwai-neko-vars';
      style.textContent = NEKO_CSS_VARS;
      document.head.appendChild(style);
    }
  }, []);

  const onSearch = useCallback(() => {
    const trimmed = query.trim();
    if (!trimmed) return;
    setBusy(true);
    const url = new URL(window.location.href);
    url.searchParams.set('mwai_library_search', trimmed);
    url.searchParams.delete('s');
    url.searchParams.delete('paged');
    window.location.href = url.toString();
  }, [query]);

  const onClear = useCallback(() => {
    const url = new URL(window.location.href);
    url.searchParams.delete('mwai_library_search');
    window.location.href = url.toString();
  }, []);

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6, width: '100%' }}>
      <AiIcon icon="wand" size={18} style={{ margin: 0, flexShrink: 0, display: 'block' }} />
      <NekoInput
        value={query}
        placeholder="AI Search..."
        style={{ flex: 1, minWidth: 100 }}
        onChange={setQuery}
        onEnter={onSearch}
      />
      <NekoButton className="primary" busy={busy} disabled={busy}
        onClick={onSearch} style={{ flexShrink: 0 }}>
        Search
      </NekoButton>
      {initialQuery && (
        <NekoButton className="secondary" onClick={onClear} style={{ flexShrink: 0 }}>
          Clear
        </NekoButton>
      )}
    </div>
  );
};

function mountSearchUI(target, position = 'replace') {
  const container = document.createElement('div');
  container.className = 'mwai-library-search';

  if (position === 'replace') {
    target.parentNode.insertBefore(container, target);
    target.style.display = 'none';
  }
  else {
    target.appendChild(container);
  }

  render(wp.element.createElement(LibrarySearch), container);
}

document.addEventListener('DOMContentLoaded', () => {
  if (!window.mwaiLibrarySearch) return;

  // List mode: replace the .search-box inside .wp-filter
  const searchBox = document.querySelector('.search-box');
  if (searchBox) {
    mountSearchUI(searchBox, 'replace');
    // Vertically center: .wp-filter is ~54px, our controls are 30px → 12px top margin
    const container = document.querySelector('.mwai-library-search');
    if (container) {
      container.style.marginTop = '12px';
    }
  }

  // Grid mode: replace native search in .media-toolbar-primary (WP's right-side area)
  const tryInjectGrid = () => {
    const primaryBar = document.querySelector('.media-toolbar-primary');
    if (!primaryBar) return false;

    primaryBar.innerHTML = '';
    mountSearchUI(primaryBar, 'append');
    return true;
  };

  if (!tryInjectGrid()) {
    let attempts = 0;
    const interval = setInterval(() => {
      if (tryInjectGrid() || ++attempts > 20) {
        clearInterval(interval);
      }
    }, 200);
  }

  // Grid mode: inject search term into Backbone AJAX requests
  const activeSearch = new URLSearchParams(window.location.search).get('mwai_library_search');
  if (activeSearch && wp.media?.model?.Query) {
    const origProps = wp.media.model.Query.prototype.initialize;
    wp.media.model.Query.prototype.initialize = function() {
      origProps.apply(this, arguments);
      this.props.set('mwai_library_search', activeSearch);
    };
  }
});
