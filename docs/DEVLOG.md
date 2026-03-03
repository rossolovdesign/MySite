# DEVLOG (AI-ориентированный)

Контекст и ключевые решения. Формат: ключевые слова, пути, константы.

---

## Проект / Стек

- Портфолио: лендинг + `/projects` + `/projects/[slug]`.
- Next.js 16 (App Router), React 19, Tailwind 4, Geologica.
- Sanity: `sanity/queries.ts`, `sanity/image.ts` (`urlFor`), Studio `/studio`.
- 3D главная: `components/Scene3D.tsx`, dynamic import, ssr: false.

---

## Маршруты

| path | описание |
|------|----------|
| `/` | Лендинг, 3D, кнопка «Проекты», TELEGRAM/MAIL. |
| `/projects` | Сетка карточек: thumbnail, title, shortDescription, tags. `getProjects()` без scenes. |
| `/projects/[slug]` | Деталь: левая колонка — скролл сцен; правая — заголовок, описание активной сцены, навигация по заголовкам. |
| `/studio` | Sanity Studio. |

---

## Sanity

- Типы: `project`, `scene`. Схемы: `sanity/schemaTypes/index.ts`.
- **getProjects()**: без `scenes[]` (только список карточек). Поля: _id, title, slug, shortDescription, date, tags, thumbnail.asset->.
- **getProjectBySlug(slug)**: полный проект с `scenes[]->` (image.asset->, order), сортировка по order.
- Project: нет поля description, только shortDescription.

---

## Детальная страница `ProjectDetailView.tsx`

**Файл:** `components/ProjectDetailView.tsx`. Клиентский компонент, получает `project: Project`.

**Левая колонка (скролл сцен):**
- Контейнер скролла: `ref={leftRef}`, класс `scrollbar-hide`, без pt/pb у контейнера.
- Начало скролла: `useEffect` при монте `leftRef.current.scrollTop = 0`.
- Секции: высота `SECTION_HEIGHT_CSS = 'calc(100% - 64px)'`, зазор между секциями `SECTION_GAP_PX = 32`. Первая секция: `marginTop: 32`, последняя: `marginBottom: 32`, остальные `marginBottom: 32`. «Язычки» соседних фото — за счёт 64px (2×32) вычета из высоты секции.
- Scroll-snap отключён (нет scrollSnapType/scrollSnapAlign).
- Клик по секции: `onClick={() => scrollToSection(i)}`. `scrollToSection(index)` вызывает `el.scrollIntoView({ behavior: 'smooth', block: 'center' })`.

**Активная сцена (IntersectionObserver):**
- root: `leftRef.current` (скролл-контейнер).
- threshold: `[0.7]`. Активная = секция с макс. intersectionRatio.
- setActiveIndex → правый блок показывает заголовок/описание этой сцены.

**Доскраливание:**
- `useEffect` по `activeIndex`: при смене индекса (не при первом рендере) вызывается `scrollToSection(activeIndex)`. Первый рендер пропускается через `prevActiveIndex.current === null`.

**CoverImageBox (внутри секции):**
- Размер: aspectRatio из dimensions или 16/10, `maxHeight` из пропа (на детальной передаётся "100%"), `maxWidth: 'min(100%, 1400px)'`, `alignSelf: 'center'` — контейнер не растягивается на весь экран, совпадает с размером фото.
- Картинка: `background-size: contain` (полная видимость, без обрезки). clipPath `inset(0 round 32px)`.
- Skeleton: класс `skeleton-image`, `absolute inset-0`, тот же clipPath. Размер = родитель (родитель ограничен по ширине/соотношению сторон → скелетон по размеру фото).
- Загрузка: скрытый `<img>` onLoad → setLoaded(true), skeleton скрывается.

**Правая колонка (lg+):** Link «Проекты», title проекта, контент activeScene (title + description) или теги, внизу nav по sectionTitles с `scrollToSection(index)`.

**Мобилка:** фиксированные шапка/подвал с Link «Проекты» и заголовком/описанием активной сцены.

---

## Список проектов `/projects`

- `app/projects/page.tsx` — серверный, `getProjects()`.
- Карточка: `ProjectCardImage` (skeleton до onLoad), title, shortDescription, tags. Link на `/projects/[slug]`.
- Hover карточки: `hover:border-[#affc41] hover:bg-[#affc41]/10`.

---

## Главная `/` (app/page.tsx)

- Кнопка «Проекты»: стекло `bg-[rgba(0,162,255,0.25)]`, backdrop blur 12px, hover: `hover:bg-[#affc41] hover:border-[#affc41] hover:text-[#00060a] hover:scale-[1.02]`. Перекрас/бордер моментальный, scale плавный (transition-transform). Круг со стрелкой: `group-hover:translate-x-0.5 group-hover:scale-105`, `duration-75`.
- TELEGRAM/MAIL: `border-[#affc41]`, hover `bg-[#affc41] text-[#00060a]`.

---

## Глобальные стили и компоненты

- **body:** `overflow: hidden` (app/globals.css) — нет полосы прокрутки у окна.
- **Скроллбар:** `.scrollbar-project` — тонкий белый; `.scrollbar-hide` — полное скрытие (scrollbar-width: none, webkit-scrollbar display:none). Деталь: левая колонка и правая колонка с контентом используют scrollbar-hide.
- **Skeleton:** класс `.skeleton-image` в globals.css (градиент + animation skeleton-shimmer). Используется в `CoverImageBox` и `ProjectCardImage`.
- **Фон:** `components/SiteBackground.tsx` — без 'use client'. Слой #00060a, радиальный градиент, сетка 4%, размытое пятно (opacity 1, без анимации). В layout первым в body, контент в `relative z-10`.

---

## Ключевые файлы

- Деталь: `components/ProjectDetailView.tsx`, `app/projects/[slug]/page.tsx`.
- Список: `app/projects/page.tsx`, `components/ProjectCardImage.tsx`.
- Sanity: `sanity/queries.ts`, `sanity/schemaTypes/index.ts`, `sanity/image.ts`.
- Стили: `app/globals.css`.
- Фон: `components/SiteBackground.tsx`. Layout: `app/layout.tsx`.

---

## Next.js 16

- params/searchParams в page — Promise: `const { slug } = await params`.
