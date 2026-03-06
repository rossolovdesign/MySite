import type { Metadata } from 'next'
import Link from 'next/link'
import { Scene3D } from '@/components/Scene3D'

export const metadata: Metadata = {
  alternates: {
    canonical: '/',
    languages: {
      ru: '/',
      en: '/en',
    },
  },
}

export default function Home() {
  return (
    <main className="w-screen h-screen relative overflow-hidden">
      {/* Desktop/Tablet Layout - Centered with aligned side blocks */}
      <div className="hidden md:flex absolute inset-0 z-20 flex-col items-center justify-center px-8 pointer-events-auto overflow-hidden">
        <div className="flex-1 flex flex-col items-center justify-center w-full min-h-0">
          {/* Заголовок: выравнивание по границам левого/правого блоков (лёгкий сдвиг влево и отступ справа). Размер от контейнера (cqw). */}
          <div className="w-full max-w-[1400px] @container shrink-0 mb-16 -ml-2 pr-6 pl-0 box-border">
            <h1 className="font-semibold text-white tracking-[0.2em] leading-tight whitespace-nowrap animate-in fade-in duration-700 text-center w-full" style={{ fontSize: 'clamp(24px, 9cqw, 128px)' }}>
              ВАНЯ РОССОЛОВ
            </h1>
          </div>

          {/* Content Row - та же ширина, что и заголовок выше */}
          <div className="flex items-start justify-between w-full max-w-[1400px]">
          {/* Left Column - Aligns with left edge of heading */}
          <div className="flex flex-col gap-6 flex-shrink-0 animate-in fade-in duration-700" style={{ maxWidth: '280px', textAlign: 'left' }}>
            <div className="inline-flex h-12 items-center justify-center gap-2.5 px-4 py-3 bg-[#FF99E5] rounded-full whitespace-nowrap flex-shrink-0">
              <span className="font-light text-[#00060A] text-2xl tracking-wider whitespace-nowrap">
                PRODUCT DESIGNER
              </span>
            </div>

            <div className="space-y-0 leading-custom">
              <p className="font-light text-white text-2xl">Работаю с 2019 года</p>
              <p className="font-light text-white text-2xl">30+ проектов</p>
              <p className="font-light text-white text-2xl">5 крупных проектов</p>
            </div>
          </div>

          {/* Center - 3D Scene (масштабируется под экран) */}
          <div
            className="flex-shrink-0 animate-in fade-in duration-700"
            style={{
              width: 'clamp(200px, 35vw, 440px)',
              height: 'clamp(280px, 45vh, 500px)',
            }}
          >
            <Scene3D />
          </div>

          {/* Right Column - Aligns with right edge of heading */}
          <div className="flex flex-col items-end gap-12 flex-shrink-0 animate-in fade-in duration-700" style={{ maxWidth: '280px', textAlign: 'right' }}>
            {/* Message Block 1 */}
            <p className="font-light text-white text-2xl text-right leading-custom">
              Здесь я собрал работы,<br />которыми горжусь
            </p>

            {/* Message Block 2 with Contact Links */}
            <div className="flex flex-col items-end gap-4 animate-in fade-in duration-700 delay-200">
              <p className="font-light text-white text-2xl text-right leading-custom">
                Пообщаться со мной<br />можно тут
              </p>

              <div className="flex gap-3 flex-wrap justify-end">
                <a
                  href="https://t.me/RossolovDesign"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-full border border-[#affc41] text-[#affc41] font-light text-2xl transition-all duration-300 inline-flex items-center gap-2 hover:bg-[#affc41] hover:text-[#00060a] group hover:scale-110"
                >
                  TELEGRAM
                  <svg
                    className="w-5 h-5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M7 17L17 7M17 7H7m10 0V17" />
                  </svg>
                </a>

                <a
                  href="mailto:rossolovdesign@gmail.com"
                  className="px-4 py-2 rounded-full border border-[#affc41] text-[#affc41] font-light text-2xl transition-all duration-300 inline-flex items-center gap-2 hover:bg-[#affc41] hover:text-[#00060a] group hover:scale-110"
                >
                  EMAIL
                  <svg
                    className="w-5 h-5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M7 17L17 7M17 7H7m10 0V17" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
        </div>

        {/* Desktop: кнопка Проекты и переключатель языка — под контентом */}
        <div className="hidden md:flex shrink-0 w-full max-w-[1400px] items-center justify-between px-0 py-8 lg:py-12">
          <Link
            href="/projects"
            className="flex items-center gap-3 px-10 py-6 rounded-2xl cursor-pointer transition-all duration-300 group animate-in fade-in w-[500px] h-[104px] bg-[#AFFC41] hover:opacity-90 hover:scale-110 overflow-hidden"
          >
            <span className="font-light text-[#00060A] text-2xl relative z-10">Проекты</span>
            <div className="ml-auto inline-flex items-center justify-center w-10 h-10 rounded-full bg-[#00060A]/70 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1 relative z-10">
              <svg
                className="w-5 h-5 text-white"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </div>
          </Link>
          <div className="flex items-center gap-3">
            <span className="inline-flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-[#AFFC41] text-[#00060A] font-light text-2xl">
              RU
            </span>
            <Link
              href="/en"
              className="inline-flex h-20 w-20 shrink-0 items-center justify-center rounded-full border border-transparent text-white hover:text-[#00060A] hover:bg-[#AFFC41] hover:border-[#AFFC41] transition-all duration-300 hover:scale-110 font-light text-2xl"
            >
              ENG
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile Layout — без скролла, сцена 3D растягивается/сжимается */}
      <div
        className="md:hidden absolute inset-0 flex flex-col items-center justify-start px-7 max-[740px]:px-5 pt-8 pb-6 z-20 gap-4 overflow-hidden"
        style={{ paddingBottom: 'max(20px, calc(20px + env(safe-area-inset-bottom)))' }}
      >
        <div className="w-full shrink-0 min-w-0 self-stretch @container">
          <h1
            className="font-semibold text-white tracking-[0.2em] leading-tight whitespace-nowrap w-full text-center"
            style={{
              fontSize: 'min(9.5cqw, 7.8vw)',
            }}
          >
            ВАНЯ РОССОЛОВ
          </h1>
        </div>

        <div className="w-full flex-1 min-h-0 rounded-lg overflow-hidden shrink-0">
          <Scene3D />
        </div>

        <div className="w-full space-y-4 max-w-md text-left self-start">
          <div className="flex justify-start">
            <div className="px-3 py-1.5 rounded-full bg-[#FF99E5] text-[#00060A] font-light tracking-wider whitespace-nowrap" style={{ fontSize: 'clamp(14px, 4vw, 16px)' }}>
              PRODUCT DESIGNER
            </div>
          </div>

          <div className="space-y-0.5">
            <p className="font-light text-white leading-tight text-base">Работаю с 2019 года</p>
            <p className="font-light text-white leading-tight text-base">30+ проектов</p>
            <p className="font-light text-white leading-tight text-base">5 крупных проектов</p>
          </div>

          <div className="space-y-0.5">
            <p className="font-light text-white leading-tight text-base">
              Здесь я собрал работы, которыми горжусь
            </p>
            <p className="font-light text-white leading-tight text-base">
              Пообщаться со мной можно тут
            </p>
          </div>

          <div className="flex gap-2 justify-start flex-wrap pt-0.5">
            <a
              href="https://t.me/RossolovDesign"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-full border border-[#affc41] text-[#affc41] font-light transition-all duration-300 inline-flex items-center gap-2 hover:bg-[#affc41] hover:text-[#00060a] group"
              style={{ fontSize: 'clamp(14px, 4vw, 16px)' }}
            >
              TELEGRAM
              <svg
                className="w-4 h-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M7 17L17 7M17 7H7m10 0V17" />
              </svg>
            </a>
            <a
              href="mailto:rossolovdesign@gmail.com"
              className="px-4 py-2 rounded-full border border-[#affc41] text-[#affc41] font-light transition-all duration-300 inline-flex items-center gap-2 hover:bg-[#affc41] hover:text-[#00060a] group"
              style={{ fontSize: 'clamp(14px, 4vw, 16px)' }}
            >
              EMAIL
              <svg
                className="w-4 h-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M7 17L17 7M17 7H7m10 0V17" />
              </svg>
            </a>
          </div>

          <div className="flex gap-2 justify-start flex-wrap pt-0.5">
            <span className="inline-flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#AFFC41] text-[#00060A] font-light text-lg">
              RU
            </span>
            <Link
              href="/en"
              className="inline-flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-transparent text-white hover:text-[#00060A] hover:bg-[#AFFC41] hover:border-[#AFFC41] transition-all duration-300 font-light text-lg"
            >
              ENG
            </Link>
          </div>
        </div>

        {/* Mobile Projects Button — в потоке контента */}
        <Link
          href="/projects"
          className="md:hidden w-full shrink-0 -mx-7 max-[740px]:-mx-5 px-7 max-[740px]:px-5 py-5 max-[740px]:py-4 mt-14 rounded-2xl cursor-pointer transition-all duration-300 group flex items-center gap-3 bg-[#AFFC41] hover:opacity-90 hover:scale-110 overflow-hidden"
        >
          <span className="font-light text-[#00060A] relative z-10" style={{ fontSize: 'clamp(14px, 4vw, 16px)' }}>Проекты</span>
          <div className="ml-auto inline-flex items-center justify-center w-8 h-8 rounded-full bg-[#00060A]/70 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1 relative z-10">
            <svg
              className="w-4 h-4 text-white"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </div>
        </Link>
      </div>
    </main>
  )
}
