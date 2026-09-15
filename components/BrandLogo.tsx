type BrandLogoProps = {
  className?: string;
  showWordmark?: boolean;
};

export default function BrandLogo({ className = '', showWordmark = false }: BrandLogoProps) {
  const icon = (
    <svg
      viewBox="0 0 120 120"
      className={className}
      role="img"
      aria-label="All Rechargeable Plus logo"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="brand-bg" x1="0%" x2="100%" y1="0%" y2="100%">
          <stop offset="0%" stopColor="#3a1d8f" />
          <stop offset="100%" stopColor="#6b32d3" />
        </linearGradient>
      </defs>
      <circle cx="60" cy="60" r="42" fill="none" stroke="#f5ecff" strokeWidth="7" />
      <rect x="38" y="38" width="44" height="44" rx="8" fill="#f7b7d5" />
      <circle cx="60" cy="60" r="8" fill="#f5ecff" opacity="0.9" />
    </svg>
  );

  if (!showWordmark) {
    return icon;
  }

  return (
    <div className="flex items-center gap-3">
      {icon}
      <div className="leading-none">
        <div className="text-[0.8rem] font-black tracking-[0.18em] text-white sm:text-[1rem]">ALL RECHARGEABLE</div>
        <div className="text-[0.8rem] font-black tracking-[0.18em] text-white sm:text-[1rem]">PLUS</div>
      </div>
    </div>
  );
}
