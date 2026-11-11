interface DashboardHeaderProps {
  title?: string;
  subtitle?: string;
  search?: string;
  searchPlaceholder?: string;
  onSearchChange?: (value: string) => void;
  actionHref: string;
  actionLabel: string;
  onMenuOpen: () => void;
}

export function DashboardHeader({
  title,
  subtitle,
  search,
  searchPlaceholder = 'Search',
  onSearchChange,
  actionHref,
  actionLabel,
  onMenuOpen,
}: DashboardHeaderProps) {
  return (
    <header className="dashboard-header">
      <button className="dashboard-menu" type="button" aria-label="Open navigation" onClick={onMenuOpen}>
        <span /><span /><span />
      </button>
      {search !== undefined && onSearchChange ? (
        <label className="dashboard-search">
          <span aria-hidden="true">⌕</span>
          <span className="sr-only">{searchPlaceholder}</span>
          <input type="search" value={search} onChange={(event) => onSearchChange(event.target.value)} placeholder={searchPlaceholder} />
        </label>
      ) : (
        <div className="dashboard-header__title">
          <strong>{title}</strong>
          {subtitle && <span>{subtitle}</span>}
        </div>
      )}
      <a className="dashboard-header__create" href={actionHref}>
        <span aria-hidden="true">＋</span>{actionLabel}
      </a>
    </header>
  );
}
