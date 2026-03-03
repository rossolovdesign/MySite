'use client'

import { useState } from 'react'
import Link from 'next/link'
import dynamic from 'next/dynamic'

const Scene3D = dynamic(() => import('@/components/Scene3D').then(mod => mod.Scene3D), {
  ssr: false,
  loading: () => <div className="w-full h-full rounded-xl bg-gradient-to-br from-[#003d5c] to-[#00060a] animate-pulse" />,
})

export default function Home() {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <main className="w-screen h-screen relative overflow-hidden bg-[#00060a]">
      {/* Background with radial gradient - Full coverage */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_center,#002033_0%,#00060a_100%)]" />

      {/* Grid Pattern Background */}
      <div 
        className="fixed inset-0"
        style={{
          backgroundImage: `
            linear-gradient(0deg, rgba(255,255,255,0.02) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)
          `,
          backgroundSize: '95.24px 95.24px',
        }}
      />

      {/* Fade Shadow - Blue glow under head */}
      <div className="fixed inset-0 pointer-events-none flex items-center justify-center overflow-hidden">
        <svg
          width="1189"
          height="900"
          viewBox="0 0 1189 900"
          className="w-full h-full min-w-full min-h-full object-cover"
          fill="none"
          preserveAspectRatio="xMidYMid slice"
        >
          <g filter="url(#filter0_f)">
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M538.249 235.939C613.131 222.335 694.095 207.717 757.437 249.909C831.059 298.948 883.824 380.752 888.287 469.098C892.924 560.906 861.254 667.214 780.759 711.608C705.658 753.027 620.778 685.482 538.249 662.148C489.142 648.263 442.284 636.842 402.647 604.7C356.9 567.605 303.489 527.901 300.176 469.098C296.773 408.691 343.23 359.639 386.456 317.305C429.094 275.548 479.53 246.606 538.249 235.939Z"
              fill="#00A1FF"
              fillOpacity="0.5"
            />
          </g>
          <defs>
            <filter
              id="filter0_f"
              x="0"
              y="-78"
              width="1188.73"
              height="1102.76"
              filterUnits="userSpaceOnUse"
            >
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
              <feGaussianBlur stdDeviation="150" result="effect1_foregroundBlur" />
            </filter>
          </defs>
        </svg>
      </div>

      {/* Desktop/Tablet Layout - Centered with aligned side blocks */}
      <div className="hidden md:flex absolute inset-0 z-20 flex-col items-center justify-center px-8 pointer-events-auto overflow-hidden">
        {/* Main Title - Centered, 128pt, No Truncation */}
        <h1 className="font-semibold text-white tracking-[0.2em] leading-tight whitespace-nowrap animate-in fade-in duration-700 mb-16 text-center px-8" style={{ fontSize: 'clamp(32px, 12vw, 128px)', maxWidth: 'calc(100vw - 128px)', width: 'fit-content', display: 'block', margin: '0 auto 64px auto' }}>
          ВАНЯ РОССОЛОВ
        </h1>

        {/* Content Row - Aligned with heading edges */}
        <div className="flex items-start justify-between w-full gap-12 lg:gap-20" style={{ maxWidth: '1400px', width: '100%' }}>
          {/* Left Column - Aligns with left edge of heading */}
          <div className="flex flex-col gap-6 flex-shrink-0 animate-in fade-in duration-700" style={{ maxWidth: '280px', textAlign: 'left' }}>
            <div className="inline-flex h-12 items-center justify-center gap-2.5 px-4 py-3 bg-[#affc41] rounded-full border border-white/30 whitespace-nowrap flex-shrink-0">
              <span className="font-extralight text-[#00060a] text-2xl tracking-wider whitespace-nowrap">
                PRODUCT DESIGNER
              </span>
            </div>

            <div className="space-y-0 leading-custom">
              <p className="font-extralight text-white text-2xl">Работаю с 2019 года</p>
              <p className="font-extralight text-white text-2xl">30+ проектов</p>
              <p className="font-extralight text-white text-2xl">5 крупных проектов</p>
            </div>
          </div>

          {/* Center - 3D Scene */}
          <div className="w-72 flex-shrink-0 animate-in fade-in duration-700" style={{ height: '500px', maxWidth: '440px' }}>
            <Scene3D />
          </div>

          {/* Right Column - Aligns with right edge of heading */}
          <div className="flex flex-col items-end gap-12 flex-shrink-0 animate-in fade-in duration-700" style={{ maxWidth: '280px', textAlign: 'right' }}>
            {/* Message Block 1 */}
            <p className="font-extralight text-white text-2xl text-right leading-custom">
              Здесь я собрал работы,<br />которыми горжусь
            </p>

            {/* Message Block 2 with Contact Links */}
            <div className="flex flex-col items-end gap-4 animate-in fade-in duration-700 delay-200">
              <p className="font-extralight text-white text-2xl text-right leading-custom">
                Пообщаться со мной<br />можно тут
              </p>

              <div className="flex gap-3 flex-wrap justify-end">
                <a
                  href="https://t.me/Rossolov"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-full border border-[#affc41] text-[#affc41] font-extralight text-2xl transition-all duration-300 inline-flex items-center gap-2 hover:bg-[#affc41] hover:text-[#00060a] group hover:scale-110"
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
                  className="px-4 py-2 rounded-full border border-[#affc41] text-[#affc41] font-extralight text-2xl transition-all duration-300 inline-flex items-center gap-2 hover:bg-[#affc41] hover:text-[#00060a] group hover:scale-110"
                >
                  MAIL
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

      {/* Projects Button - Fixed Bottom Left */}
      <Link
        href="/projects"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="hidden md:flex absolute left-8 lg:left-12 bottom-8 lg:bottom-12 items-center gap-3 px-6 py-4 rounded-2xl border border-white/25 cursor-pointer transition-all duration-300 group z-20 animate-in fade-in duration-700 delay-200 w-96"
        style={{
          background: isHovered ? 'rgba(0, 161, 255, 0.35)' : 'rgba(0, 161, 255, 0.25)',
          backdropFilter: 'blur(2px)',
        }}
      >
        <span className="font-extralight text-white text-2xl">Проекты</span>
        <div className="ml-auto inline-flex items-center justify-center w-10 h-10 rounded-full border border-white/30 transition-all group-hover:translate-x-1 group-hover:scale-110">
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

      {/* Mobile Layout */}
      <div className="md:hidden absolute inset-0 flex flex-col items-center justify-center px-6 py-8 z-20 pt-24 space-y-6 pb-40">
        <h1 className="text-center font-semibold text-white text-3xl sm:text-4xl tracking-wider">ВАНЯ РОССОЛОВ</h1>

        <div className="w-full h-80 rounded-lg overflow-hidden">
          <Scene3D />
        </div>

        <div className="space-y-6 w-full">
          <div className="flex justify-center">
            <div className="px-3 py-1.5 rounded-full bg-[#affc41] text-[#00060a] font-extralight text-xs tracking-wider whitespace-nowrap">
              PRODUCT DESIGNER
            </div>
          </div>

          <div className="space-y-3 text-center">
            <p className="font-extralight text-white leading-6" style={{ fontSize: 'clamp(16px, 5vw, 20px)', lineHeight: '24px' }}>Работаю с 2019 года</p>
            <p className="font-extralight text-white leading-6" style={{ fontSize: 'clamp(16px, 5vw, 20px)', lineHeight: '24px' }}>30+ проектов</p>
            <p className="font-extralight text-white leading-6" style={{ fontSize: 'clamp(16px, 5vw, 20px)', lineHeight: '24px' }}>5 крупных проектов</p>
          </div>

          <p className="font-extralight text-white text-center leading-6" style={{ fontSize: 'clamp(16px, 5vw, 20px)', lineHeight: '24px' }}>
            Здесь я собрал работы, которыми горжусь
          </p>

          <p className="font-extralight text-white text-center leading-6" style={{ fontSize: 'clamp(16px, 5vw, 20px)', lineHeight: '24px' }}>
            Пообщаться со мной можно тут
          </p>

          <div className="flex gap-2 justify-center flex-wrap">
            <a
              href="https://t.me/Rossolov"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded-full border border-[#affc41] text-[#affc41] font-extralight hover:bg-[#affc41] hover:text-[#00060a] transition-all"
              style={{ fontSize: 'clamp(14px, 4vw, 16px)' }}
            >
              TELEGRAM
            </a>
            <a
              href="mailto:rossolovdesign@gmail.com"
              className="px-3 py-1.5 rounded-full border border-[#affc41] text-[#affc41] font-extralight hover:bg-[#affc41] hover:text-[#00060a] transition-all"
              style={{ fontSize: 'clamp(14px, 4vw, 16px)' }}
            >
              MAIL
            </a>
          </div>
        </div>
      </div>

      {/* Mobile Projects Button - Fixed to bottom */}
      <Link
        href="/projects"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="md:hidden fixed bottom-7 left-7 right-7 z-30 px-6 py-4 rounded-2xl border border-white/25 cursor-pointer transition-all duration-300 group flex items-center gap-3"
        style={{
          background: isHovered ? 'rgba(0, 161, 255, 0.35)' : 'rgba(0, 161, 255, 0.25)',
          backdropFilter: 'blur(2px)',
        }}
      >
        <span className="font-extralight text-white text-lg">Проекты</span>
        <div className="ml-auto inline-flex items-center justify-center w-8 h-8 rounded-full border border-white/30 transition-all group-hover:translate-x-1 group-hover:scale-110">
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
    </main>
  )
}
