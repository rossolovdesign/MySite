/** Общий фон сайта: цвет, радиальный градиент, сетка (4%), синее размытое пятно. Везде непрозрачность 1, без анимации. */
export function SiteBackground() {
  return (
    <>
      <div
        className="fixed inset-0 z-0 pointer-events-none bg-[#00060a]"
        aria-hidden
      />
      <div
        className="fixed inset-0 z-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,#002033_0%,#00060a_100%)]"
        aria-hidden
      />
      <div
        className="fixed inset-0 z-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(0deg, rgba(255,255,255,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)
          `,
          backgroundSize: '95.24px 95.24px',
        }}
        aria-hidden
      />
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden" aria-hidden>
        <div
          className="absolute left-1/2 top-[52%] w-[70vmax] h-[60vmax] -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            background:
              'radial-gradient(ellipse at center, rgba(0,161,255,0.5) 0%, rgba(0,161,255,0.18) 35%, transparent 58%)',
            filter: 'blur(110px)',
            opacity: 1,
          }}
        />
      </div>
    </>
  )
}
