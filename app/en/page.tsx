import type { Metadata } from 'next'
import Link from 'next/link'
import { Scene3D } from '@/components/Scene3D'

export const metadata: Metadata = {
  title: 'Ivan Rossolov — Product Designer',
  description: 'Product designer portfolio: projects, UX/UI case studies and visual concepts.',
  alternates: {
    canonical: '/en',
    languages: {
      en: '/en',
      ru: '/',
    },
  },
}

export default function HomeEn() {
  return (
    <main className="w-screen h-screen relative overflow-hidden">
      <div className="hidden md:flex absolute inset-0 z-20 flex-col items-center justify-center px-8 pointer-events-auto overflow-hidden">
        <div className="w-full max-w-[1400px] @container shrink-0 mb-16 -ml-2 pr-6 pl-0 box-border">
          <h1 className="font-semibold text-white tracking-[0.2em] leading-tight whitespace-nowrap animate-in fade-in duration-700 text-center w-full" style={{ fontSize: 'clamp(24px, 9cqw, 128px)' }}>
            IVAN ROSSOLOV
          </h1>
        </div>

        <div className="flex items-start justify-between w-full gap-12 lg:gap-20 max-w-[1400px]">
          <div className="flex flex-col gap-6 flex-shrink-0 animate-in fade-in duration-700" style={{ maxWidth: '280px', textAlign: 'left' }}>
            <div className="inline-flex h-12 items-center justify-center gap-2.5 px-4 py-3 bg-[#affc41] rounded-full border border-white/30 whitespace-nowrap flex-shrink-0">
              <span className="font-thin text-[#00060a] text-2xl tracking-wider whitespace-nowrap">PRODUCT DESIGNER</span>
            </div>

            <div className="space-y-0 leading-custom">
              <p className="font-thin text-white text-2xl">Designing since 2019</p>
              <p className="font-thin text-white text-2xl">30+ projects</p>
              <p className="font-thin text-white text-2xl">5 large-scale projects</p>
            </div>
          </div>

          <div className="w-72 flex-shrink-0 animate-in fade-in duration-700" style={{ height: '500px', maxWidth: '440px' }}>
            <Scene3D />
          </div>

          <div className="flex flex-col items-end gap-12 flex-shrink-0 animate-in fade-in duration-700" style={{ maxWidth: '280px', textAlign: 'right' }}>
            <p className="font-thin text-white text-2xl text-right leading-custom">
              Here I share work
              <br />
              I am proud of
            </p>

            <div className="flex flex-col items-end gap-4 animate-in fade-in duration-700 delay-200">
              <p className="font-thin text-white text-2xl text-right leading-custom">
                Reach out to me
                <br />
                right here
              </p>

              <div className="flex gap-3 flex-wrap justify-end">
                <a
                  href="https://t.me/RossolovDesign"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-full border border-[#affc41] text-[#affc41] font-thin text-2xl transition-all duration-300 inline-flex items-center gap-2 hover:bg-[#affc41] hover:text-[#00060a] group hover:scale-110"
                >
                  TELEGRAM
                  <svg className="w-5 h-5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M7 17L17 7M17 7H7m10 0V17" />
                  </svg>
                </a>

                <a
                  href="mailto:rossolovdesign@gmail.com"
                  className="px-4 py-2 rounded-full border border-[#affc41] text-[#affc41] font-thin text-2xl transition-all duration-300 inline-flex items-center gap-2 hover:bg-[#affc41] hover:text-[#00060a] group hover:scale-110"
                >
                  MAIL
                  <svg className="w-5 h-5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M7 17L17 7M17 7H7m10 0V17" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Link
        href="/en/projects"
        className="hidden md:flex absolute left-8 lg:left-12 bottom-8 lg:bottom-12 items-center gap-3 px-7 py-6 rounded-2xl border border-[rgba(240,241,241,0.18)] cursor-pointer transition-all duration-300 group z-20 animate-in fade-in w-[500px] h-[104px] bg-[rgba(0,161,255,0.2)] hover:bg-[#affc41] hover:border-[#affc41] hover:text-[#00060a] hover:scale-110 overflow-hidden"
        style={{
          backdropFilter: 'blur(3px) saturate(128%)',
          WebkitBackdropFilter: 'blur(3px) saturate(128%)',
          backgroundImage: 'linear-gradient(180deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.04) 20%, rgba(255,255,255,0.02) 48%, rgba(255,255,255,0.006) 74%, rgba(255,255,255,0) 100%)',
          boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.2), inset 0 -1px 0 rgba(255,255,255,0.02), 0 6px 16px rgba(0,18,36,0.2)',
        }}
      >
        <span className="absolute inset-0 pointer-events-none bg-[radial-gradient(140%_115%_at_50%_-22%,rgba(255,255,255,0.1)_0%,rgba(255,255,255,0.06)_22%,rgba(255,255,255,0.028)_46%,rgba(255,255,255,0.009)_68%,rgba(255,255,255,0)_88%)]" />
        <span className="font-thin text-white/70 text-2xl group-hover:text-[#00060a] relative z-10">Projects</span>
        <div className="ml-auto inline-flex items-center justify-center w-10 h-10 rounded-full border border-[rgba(240,241,241,0.3)] group-hover:border-[#00060a] transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1 relative z-10">
          <svg className="w-5 h-5 text-[#f0f1f1] group-hover:text-[#00060a]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </div>
      </Link>

      <div className="hidden md:flex fixed right-8 bottom-8 z-30 items-center gap-3">
        <Link
          href="/"
          className="inline-flex h-20 w-20 shrink-0 items-center justify-center rounded-full border border-transparent text-white/85 hover:text-[#00060a] hover:bg-[#affc41] hover:border-[#affc41] transition-all duration-300 hover:scale-110 font-thin text-2xl"
        >
          RU
        </Link>
        <span
          className="inline-flex h-20 w-20 shrink-0 items-center justify-center rounded-full border border-[rgba(240,241,241,0.22)] text-white/90 font-thin text-2xl"
          style={{
            backgroundColor: 'rgba(0, 161, 255, 0.2)',
            backdropFilter: 'blur(3px) saturate(128%)',
            WebkitBackdropFilter: 'blur(3px) saturate(128%)',
            backgroundImage: 'linear-gradient(180deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.04) 20%, rgba(255,255,255,0.02) 48%, rgba(255,255,255,0.006) 74%, rgba(255,255,255,0) 100%)',
            boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.2), inset 0 -1px 0 rgba(255,255,255,0.02), 0 6px 16px rgba(0,18,36,0.2)',
          }}
        >
          ENG
        </span>
      </div>

      <div
        className="md:hidden absolute inset-0 flex flex-col items-center justify-start px-6 py-6 z-20 pt-14 gap-4 overflow-y-auto scrollbar-hide"
        style={{ paddingBottom: 'max(184px, calc(136px + env(safe-area-inset-bottom)))' }}
      >
        <div className="w-full shrink-0">
          <h1 className="text-center font-semibold text-white tracking-[0.2em] whitespace-nowrap w-full leading-none" style={{ fontSize: 'clamp(22px, 8vw, 40px)' }}>
            IVAN ROSSOLOV
          </h1>
        </div>

        <div className="w-full h-[clamp(140px,26vh,320px)] rounded-lg overflow-hidden shrink-0">
          <Scene3D />
        </div>

        <div className="w-full space-y-4 max-w-md text-left self-start">
          <div className="flex justify-start">
            <div className="px-3 py-1.5 rounded-full bg-[#affc41] text-[#00060a] font-thin tracking-wider whitespace-nowrap" style={{ fontSize: 'clamp(14px, 4vw, 16px)' }}>
              PRODUCT DESIGNER
            </div>
          </div>

          <div className="space-y-0.5">
            <p className="font-thin text-white leading-tight" style={{ fontSize: 'clamp(16px, 5vw, 20px)' }}>Designing since 2019</p>
            <p className="font-thin text-white leading-tight" style={{ fontSize: 'clamp(16px, 5vw, 20px)' }}>30+ projects</p>
            <p className="font-thin text-white leading-tight" style={{ fontSize: 'clamp(16px, 5vw, 20px)' }}>5 large-scale projects</p>
          </div>

          <div className="space-y-0.5">
            <p className="font-thin text-white leading-tight" style={{ fontSize: 'clamp(16px, 5vw, 20px)' }}>Here I share work I am proud of</p>
            <p className="font-thin text-white leading-tight" style={{ fontSize: 'clamp(16px, 5vw, 20px)' }}>Reach out to me right here</p>
          </div>

          <div className="flex gap-2 justify-start flex-wrap pt-0.5">
            <a
              href="https://t.me/RossolovDesign"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded-full border border-[#affc41] text-[#affc41] font-thin hover:bg-[#affc41] hover:text-[#00060a] transition-all"
              style={{ fontSize: 'clamp(14px, 4vw, 16px)' }}
            >
              TELEGRAM
            </a>
            <a
              href="mailto:rossolovdesign@gmail.com"
              className="px-3 py-1.5 rounded-full border border-[#affc41] text-[#affc41] font-thin hover:bg-[#affc41] hover:text-[#00060a] transition-all"
              style={{ fontSize: 'clamp(14px, 4vw, 16px)' }}
            >
              MAIL
            </a>
          </div>
        </div>
      </div>

      <Link
        href="/en/projects"
        className="md:hidden fixed bottom-7 left-7 right-7 max-[740px]:bottom-4 max-[740px]:left-5 max-[740px]:right-5 z-30 px-6 max-[740px]:px-5 py-4 max-[740px]:py-3 rounded-2xl border border-[rgba(240,241,241,0.18)] cursor-pointer transition-all duration-300 group flex items-center gap-3 bg-[rgba(0,161,255,0.2)] hover:bg-[#affc41] hover:border-[#affc41] hover:text-[#00060a] hover:scale-110 overflow-hidden"
        style={{
          backdropFilter: 'blur(3px) saturate(128%)',
          WebkitBackdropFilter: 'blur(3px) saturate(128%)',
          backgroundImage: 'linear-gradient(180deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.04) 20%, rgba(255,255,255,0.02) 48%, rgba(255,255,255,0.006) 74%, rgba(255,255,255,0) 100%)',
          boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.2), inset 0 -1px 0 rgba(255,255,255,0.02), 0 6px 16px rgba(0,18,36,0.2)',
        }}
      >
        <span className="absolute inset-0 pointer-events-none bg-[radial-gradient(140%_115%_at_50%_-22%,rgba(255,255,255,0.1)_0%,rgba(255,255,255,0.06)_22%,rgba(255,255,255,0.028)_46%,rgba(255,255,255,0.009)_68%,rgba(255,255,255,0)_88%)]" />
        <span className="font-thin text-white/70 text-lg max-[740px]:text-base group-hover:text-[#00060a] relative z-10">Projects</span>
        <div className="ml-auto inline-flex items-center justify-center w-8 h-8 rounded-full border border-[rgba(240,241,241,0.3)] group-hover:border-[#00060a] transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1 relative z-10">
          <svg className="w-4 h-4 text-[#f0f1f1] group-hover:text-[#00060a]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </div>
      </Link>
    </main>
  )
}

