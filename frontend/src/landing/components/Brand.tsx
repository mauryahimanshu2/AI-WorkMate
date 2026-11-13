interface BrandProps {
  href?: string;
}

export function Brand({ href = '/' }: BrandProps) {
  return (
    <a className="brand" href={href} aria-label="AI WorkMate home">
      <img className="brand__mark" src="/ai-workmate-logo.png" alt="" aria-hidden="true" />
      <span>AI WorkMate</span>
    </a>
  );
}
