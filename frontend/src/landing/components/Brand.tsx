interface BrandProps {
  href?: string;
}

export function Brand({ href = '/' }: BrandProps) {
  return (
    <a className="brand" href={href} aria-label="AI WorkMate home">
      <span className="brand__mark" aria-hidden="true">
        <span />
        <span />
        <span />
      </span>
      <span>AI WorkMate</span>
    </a>
  );
}
