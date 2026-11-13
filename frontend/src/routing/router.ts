import { useEffect, useSyncExternalStore } from 'react';

const NAVIGATION_EVENT = 'ai-workmate:navigation';

function currentLocation(): string {
  return `${window.location.pathname}${window.location.search}${window.location.hash}`;
}

function subscribe(onStoreChange: () => void): () => void {
  window.addEventListener('popstate', onStoreChange);
  window.addEventListener(NAVIGATION_EVENT, onStoreChange);

  return () => {
    window.removeEventListener('popstate', onStoreChange);
    window.removeEventListener(NAVIGATION_EVENT, onStoreChange);
  };
}

function scrollAfterNavigation(hash: string): void {
  window.requestAnimationFrame(() => {
    if (hash) {
      document.getElementById(decodeURIComponent(hash.slice(1)))?.scrollIntoView();
      return;
    }

    window.scrollTo({ top: 0, left: 0 });
  });
}

export function navigate(to: string, options: { replace?: boolean } = {}): void {
  const url = new URL(to, window.location.href);

  if (url.origin !== window.location.origin) {
    window.location.assign(url.href);
    return;
  }

  const nextLocation = `${url.pathname}${url.search}${url.hash}`;
  if (nextLocation === currentLocation()) return;

  window.history[options.replace ? 'replaceState' : 'pushState']({}, '', nextLocation);
  window.dispatchEvent(new Event(NAVIGATION_EVENT));
  scrollAfterNavigation(url.hash);
}

export function useLocation(): string {
  return useSyncExternalStore(subscribe, currentLocation, () => '/');
}

export function useSpaLinks(): void {
  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) return;

      const target = event.target;
      if (!(target instanceof Element)) return;

      const anchor = target.closest<HTMLAnchorElement>('a[href]');
      if (!anchor || anchor.target || anchor.hasAttribute('download')) return;

      const href = anchor.getAttribute('href');
      if (!href || href.startsWith('#')) return;

      const url = new URL(anchor.href, window.location.href);
      if (url.origin !== window.location.origin || !['http:', 'https:'].includes(url.protocol)) return;

      event.preventDefault();
      navigate(`${url.pathname}${url.search}${url.hash}`);
    };

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);
}
