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

---

## Update 2026-03-03 (текущий срез)

### Проект / маршруты
- `/` теперь серверный page (`app/page.tsx`), 3D оставлен клиентским в `components/Scene3D.tsx`.
- `/projects/[slug]` переведён в SSG: `generateStaticParams()` в `app/projects/[slug]/page.tsx`.
- Кнопка главной «Проекты» увеличена до `500x104` (desktop), glass-стиль и анимации синхронизированы с текущим UI.

### Деталь проекта (`components/ProjectDetailView.tsx`)
- Десктоп и мобилка разделены по интеракциям:
  - **desktop:** переключение сцен кликом по «язычкам» + мягкий доскролл;
  - **mobile:** переключение сцен стрелками в нижней карточке, ручной вертикальный скролл сцен отключён.
- Реализован fullscreen lightbox для сцен (mobile):
  - открыть по тапу на изображение;
  - zoom `+/-/100%`, закрытие `Esc/фон/кнопка`;
  - drag/pan зазумленного изображения.
- Затемнение неактивных сцен переведено на плавный `opacity`-переход (без мгновенного mount/unmount).
- Шапки и отступы доработаны:
  - в desktop sidebar: стеклянная карточка с `Закрыть` + title проекта;
  - в mobile bottom-card: верхняя строка `Закрыть` + title, актуальные отступы.

### Производительность (без изменения визуала/механик)
- `next.config.mjs`: включена оптимизация изображений (`remotePatterns` для `cdn.sanity.io`), убран `images.unoptimized`.
- `sanity/client.ts`: `useCdn: true`.
- `components/ProjectCardImage.tsx`: добавлен `sizes` для корректной отдачи responsive-изображений.
- `app/projects/page.tsx`: `prefetch={false}` у карточек проектов (меньше фонового сетевого шума).
- `components/Scene3D.tsx`:
  - рендер уже останавливается в hidden-tab;
  - `mousemove` throttled через `requestAnimationFrame`, только для `pointer: fine`.
- `components/ProjectDetailView.tsx`:
  - `CoverImageBox` мемоизирован (`memo`);
  - подготовка `preparedScenes` + image URL через `useMemo`;
  - `setActiveIndex` с защитой от лишних одинаковых апдейтов;
  - pan/wheel в lightbox batched через `requestAnimationFrame`.

---

## Update 2026-03-03 (SEO + i18n RU/EN)

### SEO
- Добавлены системные SEO-роуты:
  - `app/robots.ts` → `/robots.txt` (основной сайт открыт, `/studio` закрыт)
  - `app/sitemap.ts` → `/sitemap.xml` (включая RU и EN страницы)
- Введён helper `lib/site.ts` для нормализации `siteUrl` (берётся из env с fallback).
- Расширены metadata:
  - `app/layout.tsx`: `metadataBase`, `robots`, `openGraph`, `twitter`, canonical
  - `app/projects/page.tsx`: canonical + OG/Twitter
  - `app/projects/[slug]/page.tsx`: динамические metadata по проекту (title/description/OG image).

### Локализация (RU/EN)
- Добавлен i18n-каркас: `lib/i18n.ts` (`locales`, `defaultLocale`, helpers).
- Главная:
  - RU: `/`
  - EN: `/en` (`app/en/page.tsx`, тексты хардкодом, без CMS, как и планировалось)
- Проекты:
  - RU: `/projects`, `/projects/[slug]`
  - EN: `/en/projects`, `/en/projects/[slug]`
  - EN-страницы добавлены в `app/en/projects/page.tsx` и `app/en/projects/[slug]/page.tsx`
- Переключатель языка оставлен **только на главной** (`/` и `/en`):
  - desktop: внизу справа;
  - фиксированный размер языковых кругов `80x80`, активный язык — стеклянный, неактивный — без стекла;
  - hover неактивного языка синхронизирован с кнопкой «Проекты».
- На `/projects`, `/en/projects` и детальных страницах переключатель языка убран.

### Sanity для двух языков (fallback на RU)
- Схемы (`sanity/schemaTypes/index.ts`) расширены:
  - `project`: `titleEn`, `shortDescriptionEn`, `tagsEn`
  - `scene`: `titleEn`, `descriptionEn`
- Запросы (`sanity/queries.ts`) расширены:
  - `getProjectsByLocale(locale)`
  - `getProjectBySlugAndLocale(slug, locale)`
  - для EN используется `coalesce(...En, ...RU)` — если EN-поля не заполнены, показывается RU.

### Прочее
- Telegram-ссылка обновлена на `https://t.me/RossolovDesign` (`app/page.tsx`).
- Навигационные подписи:
  - `/projects`: «На главную»;
  - деталка проекта: «К проектам»;
  - размер шеврона в кнопках возврата приведён к `16px`, gap до текста — `4px`.

---

## Update 2026-03-04 (UI polish + performance-safe optimizations)

### Деталка проекта (`components/ProjectDetailView.tsx`)
- Мобильная карточка переразмечена под ту же иерархию, что и desktop:
  - строка `К проектам` + контролы переключения сцены на одной горизонтальной оси;
  - разделитель между `К проектам` и заголовком проекта;
  - `Совместно с ...` встроен в тот же верхний информационный блок (без лишнего разделителя).
- Логика мобильных сцен:
  - **tap по неактивной сцене** → делает сцену активной;
  - **tap по активной сцене** → открывает lightbox/zoom.
- Текстовые блоки мобильной карточки:
  - убрано обрезание (`truncate`/`line-clamp`) у заголовка и описания активной сцены;
  - уменьшены зазоры между заголовками и подстроками (для более цельной типографики).
- Lightbox mobile toolbar:
  - убран процентный индикатор (`XX%`);
  - кнопки `+/-` переведены в нейтральный blue/white стиль (без green-акцента).

### Карточки и стиль
- Единый радиус стеклянных карточек: `20px` (деталка desktop/mobile + карточки списка проектов).
- Карточки `/projects` и `/en/projects`: отступ добавлен под блоком бейджей (`tags`), без изменения внешнего блока карточки.

### Sanity / данные
- В `project` добавлено опциональное поле `collaboration`:
  - `url`, `titleRu`, `titleEn`.
- Запросы `sanity/queries.ts` расширены поддержкой `collaboration` для RU/EN с fallback по заголовкам.
- Исправлен GROQ parse issue: небезопасный `select(...)` заменён на projection через `collaboration { ... }`.

### Кастомный курсор (`components/CustomCursor.tsx`, `app/globals.css`, `app/layout.tsx`)
- Добавлен глобальный кастомный курсор для desktop (ring + dot, hover/press анимации), отключён на touch-only устройствах и в `/studio`.
- Оптимизация без изменения механики:
  - рендер курсора переведён в **on-demand rAF loop** (цикл активен только при необходимости, не крутится постоянно в idle).
  - это снижает фоновую нагрузку CPU/GPU без визуальных изменений.

---

## Update 2026-03-04 (stability + safe optimization pass)

### Мобилка: главная и список проектов
- `app/page.tsx`, `app/en/page.tsx`:
  - мобильный hero переведён в `justify-start` с уменьшенным верхним отступом (`pt-14`);
  - высота блока `Scene3D` сделана адаптивной: `h-[clamp(170px,30vh,320px)]`;
  - заголовок приведён к безопасным горизонтальным отступам контейнера (без «уезда»).
- `app/projects/page.tsx`, `app/en/projects/page.tsx`:
  - возвращён вертикальный скролл на мобильных (`h-screen + overflow-y-auto`);
  - видимый скроллбар скрыт через `scrollbar-hide` (скролл при этом сохранён).

### Иконка сайта / favicon
- Добавлен `app/icon.svg` (минималистичная синяя `R`).
- `app/layout.tsx`: убраны ссылки на несуществующие `icon-*.png` и `apple-icon.png`; оставлен единый `icon: '/icon.svg'` для устранения лишних 404 и упрощения загрузки иконок.

### SEO/URL нормализация
- `lib/site.ts`:
  - ужесточена нормализация `siteUrl` через `URL` parser;
  - добавлен safe-fallback на `https://rossolovedesign.ru`;
  - исправлена обработка «битых» значений вида `https//domain` (без `:`), чтобы metadata/OG/canonical не формировали некорректные URL.

### Sitemap
- `app/sitemap.ts`: генерация RU/EN project routes объединена в один проход по массиву проектов (без двойного `filter().map()`), без изменения результата.

### Автодеплой (надежность)
- `.github/workflows/deploy-production.yml`:
  - перед сборкой добавлена очистка возможного зависшего `next build` lock:
    - `pkill -f "next build" || true`
    - `rm -f .next/lock`
  - это снижает риск падения деплоя с ошибкой `Unable to acquire lock at .next/lock`.

### Микро-оптимизации клиентских компонентов (без изменения UX)
- `components/ProjectCardImage.tsx`:
  - компонент обёрнут в `memo` для снижения лишних перерисовок карточек;
  - добавлен `useEffect` reset `loaded` при смене `imageUrl`, чтобы skeleton/state корректно переинициализировались.
- `components/CustomCursor.tsx`:
  - в `pointerover` добавлена защита от повторной установки `hovering` в то же значение (меньше лишних `ensureRender()` вызовов).
- `components/Scene3D.tsx`:
  - resize-обработчик переведён на rAF-throttle (аналогично mousemove), чтобы уменьшить нагрузку при сериях `resize`.
- `components/ProjectDetailView.tsx`:
  - локализованный `copy` мемоизирован по `locale` через `useMemo`, чтобы не пересоздавать объект на каждом рендере.

---

## Update 2026-03-05 (шрифты, деплой, безопасность)

### Локальные шрифты Geologica
- Переход с `next/font/google` на `next/font/local` (`app/layout.tsx`).
- Файлы: `public/fonts/geologica-latin.woff2`, `geologica-cyrillic.woff2`, `geologica-cyrillic-ext.woff2`.
- Причина: сборка на VPS зависала на загрузке Google Fonts (сеть/таймаут); локальные шрифты устраняют зависимость от внешнего API при build.

### Деплой (`.github/workflows/deploy-production.yml`)
- **Удалён `rm -rf .next`** перед сборкой — при падении/таймауте build сервер оставался без `.next`, PM2 входил в crash loop (1008+ рестартов).
- **Защита `.env*`**: `git clean -fd -e '.env*'` — иначе `git clean -fd` удалял `.env.local` (Sanity, прочие переменные).
- Логика: `next build` перезаписывает `.next`; при сбое сборки старая рабочая сборка сохраняется.

### Инцидент безопасности (VPS)
- Обнаружен майнер `/tmp/.16`, rootkit `libprocesshider.so` в `/etc/ld.so.preload`, persistence через cron.
- Очистка: `kill -9` майнер, `rm -f /tmp/.16`, `echo "" | tee /etc/ld.so.preload`, очистка crontab (`printf '' > /var/spool/cron/crontabs/root`), удаление `/var/tmp/apt.log` и вредоносного `/root/.bash_logout`.
- Cron-задания запускали майнер каждую минуту и при reboot. Рекомендация: рассмотреть пересоздание VPS и смену паролей.

### Синхронизация main с продом
- Merge `reserve/local-geologica-fonts` → `main` (коммит `0a255a5`).
- main = прод: локальные шрифты + исправленный workflow.

---

## Update 2026-03-05 (ручной деплой)

### Удалён автодеплой (GitHub Actions)
- Удалён `.github/workflows/deploy-production.yml`.
- Причина: автодеплой показывал успех, но на проде оставался старый SHA; возможная связь с майнером/нагрузкой на VPS.
- Деплой теперь вручную по SSH (см. README → Deployment).

### Merge reserve → main
- `reserve/local-geologica-fonts` смержен в `main` (коммит `5159d91`).
- Изменения: удаление workflow, обновление README (ручной деплой), DEVLOG, добавлен `docs/SERVER-DIAGNOSTIC.md`.

### Продакшн
- Деплой на прод выполняется вручную: `ssh root@82.146.40.70`, затем команды из README.
- После merge в main прод нужно обновить вручную (git pull/build/pm2).

---

## Update 2026-03-05 (возврат 100% CPU)

- Проблема загрузки CPU на 100% на сервере вернулась (возможный рецидив майнера).
- `docs/SERVER-DIAGNOSTIC.md`:
  - добавлен раздел 0: быстрая проверка top/ps + /tmp + ld.so.preload;
  - добавлен раздел 4: при повторном возврате — пересоздание VPS обязательно.

---

## Update 2026-03-05 (исправление 502 / crash loop)

### Причина
- `next start` падал с `TypeError: Cannot read properties of undefined (reading '/_middleware')`.
- PM2 перезапускал приложение → crash loop → 502.
- **Корень проблемы:** в Next.js 16 middleware переименован в proxy; при отсутствии `proxy.ts` пустой `middleware-manifest.json` приводит к undefined-доступу в рантайме.

### Решение
- Добавлен минимальный `proxy.ts` в корень проекта:
  - `export function proxy(request) { return NextResponse.next(); }`
  - Просто пропускает запросы без изменений.
- Сборка: `npm run build:webpack` (или `pnpm build --webpack`).
- После добавления proxy.ts `next start` работает стабильно, главная отдаёт 200.

### Pre-built деплой (tar вместо scp -r)
- `scp -r .next` падал на больших `.pack` в `.next/cache` (Connection reset).
- Кэш не нужен для `next start` — удаляем перед упаковкой.
- Надёжный способ: `tar -czf next.tar.gz -C .next .` → scp одного файла (~5 MB) → на сервере `tar -xzf`.
- Инструкции: `docs/SERVER-DIAGNOSTIC.md` (раздел 2), `README.md` (вариант B).

---

## Update 2026-03-05 (UI: проекты, деталка, мобилка, 3D)

### Раздел проектов (`/projects`, `/en/projects`)
- Отступ контейнера карточек: 32px → 16px (`px-4`).
- Кнопка «На главную» приведена к стилю «К проектам»: `text-white/80`, `hover:text-[#affc41]`, `gap-1`, `text-sm lg:text-lg`, `h-9` на мобилке.
- Кнопка «На главную» фиксирована при скролле: `sticky top-0 z-20`, `bg-[#00060a]`.
- Верхний отступ на мобилке унифицирован с деталкой: `pt-[calc(2rem+env(safe-area-inset-top))]`.
- Паддинг сверху у контейнера карточек на мобилке: `pt-4` (16px).

### Деталка проекта — мобилка (`components/ProjectDetailView.tsx`)
- **Картинки стопкой:** одна картинка на экран, переключение только стрелками (скролл отключён).
- Каунтер между стрелками: `{activeIndex + 1} / {preparedScenes.length}`.
- **Фиксированная карточка:** `h-[40vh]`, края в край экрана (без safe-area), `rounded-t-[20px]`, `border-b-0`.
- Контент прижат к top, отступы сохранены.
- Убран `pt-6` у контейнера контролов.
- IntersectionObserver и snap-to-nearest только на desktop.

### Главная — мобилка (`app/page.tsx`, `app/en/page.tsx`)
- Текст «Работаю с 2019 года», «30+ проектов» и др.: `text-base` (16px).

### 3D (`components/Scene3D.tsx`)
- На touch-устройствах (`!hasFinePointer`): авто-вращение головы по Y, `AUTO_ROTATE_SPEED = 0.012`.

### Деплой
- Pre-built: локальная сборка `npm run build:webpack`, удаление `.next/cache` и `.next/dev`, `tar -czf next.tar.gz`, `scp` на сервер.

---

## Update 2026-03-05 (мобильная галерея, зум-бар, аудит кода)

### Деталка проекта — мобильная галерея (`components/ProjectDetailView.tsx`)
- **Свайп-галерея:** горизонтальный свайп влево/вправо для переключения картинок; анимация перелистывания (0.35s ease-out).
- **Одна картинка на экран:** ResizeObserver + пиксельные размеры для корректного отображения только активной картинки.
- **Затемнение неактивных:** `dimmed={activeIndex !== i}` как на desktop, плавный `transition-opacity`.
- **Отступ между картинками:** 16px (`marginRight`), учтено в ширине трека и `transform`.

### Lightbox — зум-бар (mobile)
- Убраны подложка и обводка контейнера; оставлены только кнопки.
- Обводка кнопок: `border-white/60`.

### Оптимизация кода (без изменения дизайна/механик)
- **lib/utils.ts:** добавлена функция `clamp()` для переиспользования.
- **ProjectDetailView.tsx:**
  - `clamp` импортируется из `@/lib/utils`, локальная копия удалена.
  - `SWIPE_THRESHOLD = 60` вынесен на уровень модуля.
  - Убран лишний `sortedScenes`; `preparedScenes` берёт данные из `project.scenes ?? []`.
  - Image probe: в cleanup добавлено `probe.src = ''` для отмены загрузки при размонтировании.
  - IntersectionObserver и snapToNearest: обход только актуальных секций через `slice(0, sectionsCount)`.

---

## Update 2026-03-05 (десктопная деталка: layout + паддинги)

### Деталка проекта — desktop (`components/ProjectDetailView.tsx`)
- **Порядок правой колонки:** контент (заголовок и описание активной сцены) перенесён наверх; карточка с кнопкой «К проектам» и заголовком проекта — вниз контейнера.
- **Паддинги правого сайдбара:** сверху и снизу по 48px (`pt-[max(48px,env(safe-area-inset-top))]`, `pb-[48px]`); верхний отступ учитывает safe-area на устройствах с вырезами.

---

## Update 2026-03-05 (порядок проектов, стеклянный бар, мобильный заголовок, деталка)

### Sanity — порядок проектов
- В схему `project` добавлено поле `order` (number): ручная сортировка в списке проектов.
- Сортировка: `order desc, date desc` — меньший order = выше в списке; при отсутствии order — по дате.
- Деплой схемы: `npx sanity schema deploy`.

### Раздел проектов (`/projects`, `/en/projects`)
- **Стеклянный бар при скролле:** кнопка «На главную» / «Home» — при прокрутке появляется полупрозрачный бар (`bg-[#00060a]/60`, `backdrop-blur-md`, `border-b border-white/5`). Гистерезис порога: показ при >12px, скрытие при <4px.
- **Компоненты:** `ProjectsPageClient` (обёртка со скроллом), `ProjectsPageHeader` (клиентский, scroll-aware). Пропсы `backHref`, `backLabel` для RU/EN.
- Убрана сплошная чёрная полоса у заголовка (бывший `bg-[#00060a]`).

### Главная — мобильный заголовок (`app/page.tsx`)
- Отступы контента синхронизированы с кнопкой «Проекты»: `px-7 max-[740px]:px-5` (как `left-5/right-5` и `left-7/right-7` у кнопки).
- Заголовок «ВАНЯ РОССОЛОВ»: `fontSize: min(9.5cqw, 7.8vw)`, `text-align: justify`, `text-justify: inter-character` — заполняет ширину контейнера без overflow.
- Контейнер: `@container`, `self-stretch`.

### Деталка проекта (`components/ProjectDetailView.tsx`)
- Паддинг карточки с кнопкой и заголовком (desktop): `pt-8 pb-8` (32px сверху и снизу).
- Текст «Совместно с» заменён на «В составе» (RU) и «As part of» (EN).

### Оптимизация (без изменения дизайна/механик)
- `ProjectsPageHeader`: обёрнут в `memo` для снижения лишних перерисовок.

---

## Update 2026-03-05 (UI-правки: кнопки, теги, фон, мобилка)

### Главная
- Кнопка MAIL переименована в EMAIL.
- Смена языка на мобилке: добавлена под TELEGRAM/EMAIL, стиль как на десктопе (круглые кнопки RU/ENG).
- Состояние `active` для интерактивных элементов на мобилке (как hover на десктопе).
- Синхронизация мобильной вёрстки EN с RU (эталон): `px-7 max-[740px]:px-5`, заголовок `min(9.5cqw, 7.8vw)`, `textAlign: justify`, `textJustify: inter-character` — контент не «прыгает» при смене языка.

### Карточки проектов
- Теги: стиль как PRODUCT DESIGNER (`bg-[#affc41]`, `text-[#00060a]`, `border-white/30`), `font-normal`, `uppercase`.

### Деталь проекта (`components/ProjectDetailView.tsx`)
- **Мобилка:** нижний бар 35% (`h-[35vh]`), картинка 100% ширины без скруглений (`rounded={false}` у CoverImageBox).
- Контроллы переключения сцен: зелёный заменён на белый (`border-white/40`, `text-white`).
- Lightbox на мобилке: убраны кнопки zoom/reset, оставлен только крестик закрытия.

### Фон (`components/SiteBackground.tsx`, `app/globals.css`)
- Удалён радиальный градиент у body — единый источник фона в SiteBackground.
- Эталон для всех страниц и платформ: главная на десктопе (сетка 95.24px, пятно top 52%).
- **Мобилка:** пятно ярче (`rgba(0,161,255,0.75)` / `0.35`), выше (`top: calc(52% - 120px)`).
