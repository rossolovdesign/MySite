import type { Metadata } from 'next'
import Link from 'next/link'
import { Scene3D } from '@/components/Scene3D'
import { DEFAULT_OG_TITLE, DEFAULT_OG_DESCRIPTION } from '@/lib/metadata'

export const metadata: Metadata = {
  title: 'Ivan Rossolov — Product Designer',
  description: DEFAULT_OG_DESCRIPTION,
  alternates: {
    canonical: '/en',
    languages: {
      en: '/en',
      ru: '/',
    },
  },
  openGraph: {
    title: DEFAULT_OG_TITLE,
    description: DEFAULT_OG_DESCRIPTION,
    url: '/en',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: DEFAULT_OG_TITLE,
    description: DEFAULT_OG_DESCRIPTION,
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

        <div className="flex items-start justify-between w-full max-w-[1400px]">
          <div className="flex flex-col gap-6 flex-shrink-0 animate-in fade-in duration-700" style={{ maxWidth: '280px', textAlign: 'left' }}>
            <div className="inline-flex h-12 items-center justify-center gap-2.5 px-4 py-3 bg-[#FF99E5] rounded-full whitespace-nowrap flex-shrink-0">
              <span className="font-light text-[#00060A] text-2xl tracking-wider whitespace-nowrap">PRODUCT DESIGNER</span>
            </div>

            <div className="space-y-0 leading-custom">
              <p className="font-thin text-white text-2xl">Designing since 2019</p>
              <p className="font-thin text-white text-2xl">30+ projects</p>
              <p className="font-thin text-white text-2xl">5 large-scale projects</p>
            </div>
          </div>

          <div
            className="flex-shrink-0 animate-in fade-in duration-700"
            style={{
              width: 'clamp(200px, 35vw, 440px)',
              height: 'clamp(280px, 45vh, 500px)',
            }}
          >
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
                  className="px-4 py-2 rounded-full border border-[#affc41] text-[#affc41] font-light text-2xl transition-all duration-300 inline-flex items-center gap-2 hover:bg-[#affc41] hover:text-[#00060a] group hover:scale-110"
                >
                  TELEGRAM
                  <svg className="w-5 h-5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M7 17L17 7M17 7H7m10 0V17" />
                  </svg>
                </a>

                <a
                  href="mailto:rossolovdesign@gmail.com"
                  className="px-4 py-2 rounded-full border border-[#affc41] text-[#affc41] font-light text-2xl transition-all duration-300 inline-flex items-center gap-2 hover:bg-[#affc41] hover:text-[#00060a] group hover:scale-110"
                >
                  EMAIL
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
        className="hidden md:flex absolute left-8 lg:left-12 bottom-8 lg:bottom-12 items-center gap-3 px-7 py-6 rounded-2xl cursor-pointer transition-all duration-300 group z-20 animate-in fade-in w-[500px] h-[104px] bg-[#AFFC41] hover:opacity-90 hover:scale-110 overflow-hidden"
      >
        <span className="font-light text-[#00060A] text-2xl relative z-10">Projects</span>
        <div className="ml-auto inline-flex items-center justify-center w-10 h-10 rounded-full bg-[#00060A] transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1 relative z-10">
          <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </div>
      </Link>

      {/* Desktop language switcher */}
      <div className="hidden md:flex fixed right-8 bottom-8 z-30 items-center gap-3">
        <Link
          href="/"
          className="inline-flex h-20 w-20 shrink-0 items-center justify-center rounded-full border border-transparent text-white/85 hover:text-[#00060A] hover:bg-[#AFFC41] hover:border-[#AFFC41] transition-all duration-300 hover:scale-110 font-light text-2xl"
        >
          RU
        </Link>
        <span className="inline-flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-[#AFFC41] text-[#00060A] font-light text-2xl">
          ENG
        </span>
      </div>

      <div
        className="md:hidden absolute inset-0 flex flex-col items-center justify-start px-7 max-[740px]:px-5 py-6 z-20 pt-14 gap-4 overflow-y-auto scrollbar-hide"
        style={{ paddingBottom: 'max(184px, calc(136px + env(safe-area-inset-bottom)))' }}
      >
        <div className="w-full shrink-0 min-w-0 self-stretch @container">
          <h1
            className="font-semibold text-white tracking-[0.2em] leading-tight whitespace-nowrap w-full"
            style={{
              fontSize: 'min(9.5cqw, 7.8vw)',
              textAlign: 'justify',
              textJustify: 'inter-character',
            }}
          >
            IVAN ROSSOLOV
          </h1>
        </div>

        <div className="w-full h-[clamp(140px,26vh,320px)] rounded-lg overflow-hidden shrink-0">
          <Scene3D />
        </div>

        <div className="w-full space-y-4 max-w-md text-left self-start">
          <div className="flex justify-start">
            <div className="px-3 py-1.5 rounded-full bg-[#FF99E5] text-[#00060A] font-light tracking-wider whitespace-nowrap" style={{ fontSize: 'clamp(14px, 4vw, 16px)' }}>
              PRODUCT DESIGNER
            </div>
          </div>

          <div className="space-y-0.5">
            <p className="font-thin text-white leading-tight text-base">Designing since 2019</p>
            <p className="font-thin text-white leading-tight text-base">30+ projects</p>
            <p className="font-thin text-white leading-tight text-base">5 large-scale projects</p>
          </div>

          <div className="space-y-0.5">
            <p className="font-thin text-white leading-tight text-base">Here I share work I am proud of</p>
            <p className="font-thin text-white leading-tight text-base">Reach out to me right here</p>
          </div>

          <div className="flex gap-2 justify-start flex-wrap pt-0.5">
            <a
              href="https://t.me/RossolovDesign"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded-full bg-[#AFFC41] text-[#00060A] font-light hover:opacity-90 active:opacity-90 transition-all"
              style={{ fontSize: 'clamp(14px, 4vw, 16px)' }}
            >
              TELEGRAM
            </a>
            <a
              href="mailto:rossolovdesign@gmail.com"
              className="px-3 py-1.5 rounded-full bg-[#AFFC41] text-[#00060A] font-light hover:opacity-90 active:opacity-90 transition-all"
              style={{ fontSize: 'clamp(14px, 4vw, 16px)' }}
            >
              EMAIL
            </a>
          </div>

          <div className="flex gap-2 justify-start flex-wrap pt-0.5">
            <Link
              href="/"
              className="inline-flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-transparent text-white/85 hover:text-[#00060A] hover:bg-[#AFFC41] hover:border-[#AFFC41] active:text-[#00060A] active:bg-[#AFFC41] active:border-[#AFFC41] active:scale-110 transition-all duration-300 font-light text-lg"
            >
              RU
            </Link>
            <span className="inline-flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#AFFC41] text-[#00060A] font-light text-lg">
              ENG
            </span>
          </div>
        </div>
      </div>

      <Link
        href="/en/projects"
        className="md:hidden fixed bottom-7 left-7 right-7 max-[740px]:bottom-4 max-[740px]:left-5 max-[740px]:right-5 z-30 px-6 max-[740px]:px-5 py-4 max-[740px]:py-3 rounded-2xl cursor-pointer transition-all duration-300 group flex items-center gap-3 bg-[#AFFC41] hover:opacity-90 active:opacity-90 hover:scale-110 active:scale-110 overflow-hidden"
      >
        <span className="font-light text-[#00060A] text-lg max-[740px]:text-base relative z-10">Projects</span>
        <div className="ml-auto inline-flex items-center justify-center w-8 h-8 rounded-full bg-[#00060A] transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1 group-active:translate-x-1 group-active:-translate-y-1 relative z-10">
          <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </div>
      </Link>
    </main>
  )
}

