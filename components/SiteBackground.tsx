'use client'

import { usePathname } from 'next/navigation'

/** Общий фон сайта: цвет #333333, сетка 60px. Пятно только на главной. */
export function SiteBackground() {
  const pathname = usePathname()
  const isHome = pathname === '/' || pathname === '/en'

  return (
    <>
      <div
        className="fixed inset-0 z-0 pointer-events-none bg-[#333333]"
        aria-hidden
      />
      {/* Сетка */}
      <div
        className="fixed inset-0 z-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(0deg, rgba(255,255,255,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
        aria-hidden
      />
      {/* Пятно только на главной */}
      {isHome && (
        <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden" aria-hidden>
          <div
            className="absolute left-1/2 top-[52%] w-[70vmax] h-[60vmax] -translate-x-1/2 -translate-y-1/2 rounded-full hidden md:block"
            style={{
              background:
                'radial-gradient(ellipse at center, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0.2) 35%, transparent 58%)',
              filter: 'blur(110px)',
              opacity: 1,
            }}
          />
          <div
            className="absolute left-1/2 w-[70vmax] h-[60vmax] -translate-x-1/2 -translate-y-1/2 rounded-full md:hidden"
            style={{
              top: 'calc(52% - 120px)',
              background:
                'radial-gradient(ellipse at center, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0.25) 35%, transparent 58%)',
              filter: 'blur(110px)',
              opacity: 1,
            }}
          />
        </div>
      )}
    </>
  )
}
