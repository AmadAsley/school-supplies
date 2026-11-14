import React from 'react';
import { VisualKind } from '../types';

interface ProductVisualProps {
  kind: VisualKind;
  customImageUrl?: string;
  alt: string;
  className?: string;
}

export const ProductVisual: React.FC<ProductVisualProps> = ({
  kind,
  customImageUrl,
  alt,
  className = 'w-full h-full',
}) => {
  if (customImageUrl) {
    return (
      <img
        src={customImageUrl}
        alt={alt}
        referrerPolicy="no-referrer"
        className={`object-cover ${className}`}
      />
    );
  }

  return (
    <div
      className={`relative flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#eaedff] via-[#f2f3ff] to-[#b2eee8]/45 ${className}`}
      aria-label={alt}
      role="img"
    >
      {kind === 'paper-a4' && (
        <svg viewBox="0 0 120 120" className="w-4/5 h-4/5 drop-shadow-sm">
          <rect x="20" y="34" width="80" height="58" rx="6" fill="#0b4f4b" />
          <rect x="20" y="28" width="80" height="54" rx="6" fill="#ffffff" stroke="#003734" strokeWidth="2.5" />
          <rect x="26" y="34" width="68" height="22" rx="3" fill="#006c49" />
          <text x="60" y="49" textAnchor="middle" fill="#ffffff" fontSize="11" fontWeight="800" fontFamily="Plus Jakarta Sans, sans-serif">
            A4 · 500s
          </text>
          <rect x="30" y="63" width="38" height="5" rx="2.5" fill="#d2d9f4" />
          <rect x="30" y="72" width="26" height="4" rx="2" fill="#e2e7ff" />
          <circle cx="84" cy="70" r="7" fill="#6cf8bb" />
        </svg>
      )}

      {kind === 'pen-gtec' && (
        <svg viewBox="0 0 120 120" className="w-4/5 h-4/5 drop-shadow-sm">
          <rect x="18" y="22" width="84" height="76" rx="8" fill="#ffffff" stroke="#dae2fd" strokeWidth="2" />
          <line x1="28" y1="42" x2="72" y2="42" stroke="#d2d9f4" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="28" y1="54" x2="64" y2="54" stroke="#d2d9f4" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="28" y1="66" x2="78" y2="66" stroke="#d2d9f4" strokeWidth="2.5" strokeLinecap="round" />
          <g transform="rotate(-32 68 62)">
            <rect x="54" y="22" width="12" height="62" rx="4" fill="#131b2e" />
            <rect x="54" y="22" width="12" height="16" rx="3" fill="#006c49" />
            <polygon points="56,84 64,84 60,98" fill="#96d1cc" />
            <circle cx="60" cy="98" r="1.5" fill="#131b2e" />
          </g>
        </svg>
      )}

      {kind === 'calculator' && (
        <svg viewBox="0 0 120 120" className="w-4/5 h-4/5 drop-shadow-sm">
          <rect x="32" y="14" width="56" height="92" rx="9" fill="#131b2e" />
          <rect x="38" y="22" width="44" height="22" rx="4" fill="#b2eee8" />
          <text x="77" y="37" textAnchor="end" fill="#003734" fontSize="11" fontWeight="800" fontFamily="monospace">
            ∫dx=0.84
          </text>
          <rect x="40" y="52" width="10" height="8" rx="2" fill="#6cf8bb" />
          <rect x="55" y="52" width="10" height="8" rx="2" fill="#3f4947" />
          <rect x="70" y="52" width="10" height="8" rx="2" fill="#3f4947" />
          <rect x="40" y="65" width="10" height="8" rx="2" fill="#3f4947" />
          <rect x="55" y="65" width="10" height="8" rx="2" fill="#3f4947" />
          <rect x="70" y="65" width="10" height="8" rx="2" fill="#3f4947" />
          <rect x="40" y="78" width="10" height="8" rx="2" fill="#3f4947" />
          <rect x="55" y="78" width="10" height="8" rx="2" fill="#3f4947" />
          <rect x="70" y="78" width="10" height="8" rx="2" fill="#ffb95f" />
          <rect x="40" y="91" width="25" height="8" rx="2" fill="#2c6863" />
          <rect x="70" y="91" width="10" height="8" rx="2" fill="#006c49" />
        </svg>
      )}

      {kind === 'drawing-pens' && (
        <svg viewBox="0 0 120 120" className="w-4/5 h-4/5 drop-shadow-sm">
          <rect x="18" y="20" width="84" height="80" rx="10" fill="#003734" />
          <rect x="24" y="26" width="72" height="68" rx="6" fill="#ffffff" />
          <rect x="33" y="34" width="9" height="52" rx="3" fill="#006c49" />
          <rect x="48" y="34" width="9" height="52" rx="3" fill="#003734" />
          <rect x="63" y="34" width="9" height="52" rx="3" fill="#2c6863" />
          <rect x="78" y="34" width="9" height="52" rx="3" fill="#131b2e" />
          <rect x="33" y="42" width="54" height="8" fill="#6cf8bb" opacity="0.85" />
        </svg>
      )}

      {kind === 'yellow-pad' && (
        <svg viewBox="0 0 120 120" className="w-4/5 h-4/5 drop-shadow-sm">
          <rect x="26" y="18" width="68" height="84" rx="5" fill="#ffddb8" stroke="#653e00" strokeWidth="2" />
          <rect x="26" y="18" width="68" height="14" rx="4" fill="#653e00" />
          <line x1="40" y1="32" x2="40" y2="100" stroke="#ba1a1a" strokeWidth="1.5" opacity="0.55" />
          <line x1="30" y1="45" x2="90" y2="45" stroke="#006c49" strokeWidth="1.2" opacity="0.4" />
          <line x1="30" y1="57" x2="90" y2="57" stroke="#006c49" strokeWidth="1.2" opacity="0.4" />
          <line x1="30" y1="69" x2="90" y2="69" stroke="#006c49" strokeWidth="1.2" opacity="0.4" />
          <line x1="30" y1="81" x2="90" y2="81" stroke="#006c49" strokeWidth="1.2" opacity="0.4" />
        </svg>
      )}

      {kind === 'textbook-calc' && (
        <svg viewBox="0 0 120 120" className="w-4/5 h-4/5 drop-shadow-sm">
          <rect x="24" y="16" width="66" height="88" rx="6" fill="#003734" />
          <rect x="32" y="16" width="62" height="88" rx="6" fill="#0b4f4b" />
          <rect x="38" y="28" width="48" height="28" rx="4" fill="#6cf8bb" />
          <text x="62" y="45" textAnchor="middle" fill="#002113" fontSize="11" fontWeight="800" fontFamily="Plus Jakarta Sans, sans-serif">
            CALCULUS
          </text>
          <text x="62" y="76" textAnchor="middle" fill="#b2eee8" fontSize="18" fontWeight="800" fontFamily="serif">
            ∫ f(x)dx
          </text>
        </svg>
      )}

      {kind === 'lab-gown' && (
        <svg viewBox="0 0 120 120" className="w-4/5 h-4/5 drop-shadow-sm">
          <path
            d="M42 22 L60 32 L78 22 L96 36 L88 54 L80 50 L80 98 L40 98 L40 50 L32 54 L24 36 Z"
            fill="#ffffff"
            stroke="#003734"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
          <line x1="60" y1="32" x2="60" y2="98" stroke="#bfc8c7" strokeWidth="2" />
          <rect x="65" y="48" width="10" height="10" rx="2" fill="#6cf8bb" />
          <rect x="44" y="68" width="11" height="13" rx="2" fill="#f2f3ff" stroke="#bfc8c7" strokeWidth="1.5" />
          <rect x="65" y="68" width="11" height="13" rx="2" fill="#f2f3ff" stroke="#bfc8c7" strokeWidth="1.5" />
        </svg>
      )}

      {kind === 'drafting-set' && (
        <svg viewBox="0 0 120 120" className="w-4/5 h-4/5 drop-shadow-sm">
          <rect x="20" y="24" width="80" height="14" rx="3" fill="#0b4f4b" />
          <rect x="53" y="24" width="14" height="76" rx="3" fill="#96d1cc" stroke="#003734" strokeWidth="2" />
          <polygon points="24,96 76,96 24,50" fill="#6cf8bb" opacity="0.85" stroke="#003734" strokeWidth="2" />
        </svg>
      )}

      {kind === 'folder' && (
        <svg viewBox="0 0 120 120" className="w-4/5 h-4/5 drop-shadow-sm">
          <path
            d="M18 34 C18 29 22 26 27 26 L48 26 L56 34 L94 34 C99 34 102 37 102 42 L102 88 C102 93 99 96 94 96 L26 96 C21 96 18 93 18 88 Z"
            fill="#006c49"
          />
          <rect x="24" y="44" width="72" height="44" rx="4" fill="#ffffff" opacity="0.92" />
          <circle cx="60" cy="66" r="6" fill="#003734" />
        </svg>
      )}

      {kind === 'printing' && (
        <svg viewBox="0 0 120 120" className="w-4/5 h-4/5 drop-shadow-sm">
          <rect x="34" y="18" width="52" height="24" rx="3" fill="#ffffff" stroke="#003734" strokeWidth="2" />
          <rect x="20" y="40" width="80" height="38" rx="8" fill="#003734" />
          <rect x="34" y="64" width="52" height="36" rx="3" fill="#ffffff" stroke="#003734" strokeWidth="2" />
          <line x1="42" y1="74" x2="78" y2="74" stroke="#006c49" strokeWidth="3" strokeLinecap="round" />
          <line x1="42" y1="84" x2="68" y2="84" stroke="#96d1cc" strokeWidth="3" strokeLinecap="round" />
          <circle cx="84" cy="52" r="4" fill="#6cf8bb" />
        </svg>
      )}

      {kind === 'notebook' && (
        <svg viewBox="0 0 120 120" className="w-4/5 h-4/5 drop-shadow-sm">
          <rect x="28" y="18" width="64" height="84" rx="7" fill="#0b4f4b" />
          <rect x="36" y="28" width="48" height="24" rx="3" fill="#ffffff" />
          <circle cx="28" cy="32" r="3.5" fill="#6cf8bb" />
          <circle cx="28" cy="48" r="3.5" fill="#6cf8bb" />
          <circle cx="28" cy="64" r="3.5" fill="#6cf8bb" />
          <circle cx="28" cy="80" r="3.5" fill="#6cf8bb" />
        </svg>
      )}
    </div>
  );
};
