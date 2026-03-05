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
      {/* Сетка квадратов и размытое пятно: эталон — главная на десктопе, одинаково на всех страницах и платформах */}
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
        {/* Десктоп */}
        <div
          className="absolute left-1/2 top-[52%] w-[70vmax] h-[60vmax] -translate-x-1/2 -translate-y-1/2 rounded-full hidden md:block"
          style={{
            background:
              'radial-gradient(ellipse at center, rgba(0,161,255,0.5) 0%, rgba(0,161,255,0.18) 35%, transparent 58%)',
            filter: 'blur(110px)',
            opacity: 1,
          }}
        />
        {/* Мобилка: ярче, выше на 40px */}
        <div
          className="absolute left-1/2 w-[70vmax] h-[60vmax] -translate-x-1/2 -translate-y-1/2 rounded-full md:hidden"
          style={{
            top: 'calc(52% - 120px)',
            background:
              'radial-gradient(ellipse at center, rgba(0,161,255,0.75) 0%, rgba(0,161,255,0.35) 35%, transparent 58%)',
            filter: 'blur(110px)',
            opacity: 1,
          }}
        />
      </div>
    </>
  )
}
