# Иван Россолов — Product Design Portfolio

A modern product design portfolio built with Next.js 16 and Sanity CMS, featuring a split-view project detail page with scene gallery and scroll-spy functionality.

## Features

- **Projects Grid**: Browse all design projects with thumbnails, descriptions, and tags
- **Project Details**: Split-view layout with full-size scene images and detailed information
- **Scene Gallery**: Interactive thumbnail gallery with active state tracking
- **Sanity CMS**: Headless CMS for managing projects and scenes
- **Responsive Design**: Mobile-first responsive layout with Tailwind CSS
- **Image Optimization**: Next.js Image optimization with Sanity image builder

## Project Structure

```
├── app/
│   ├── page.tsx                 # Home page
│   ├── projects/
│   │   ├── page.tsx             # Projects listing page
│   │   └── [slug]/
│   │       └── page.tsx         # Project detail page
│   ├── studio/
│   │   └── [[...index]]/page.tsx # Sanity Studio
│   ├── layout.tsx               # Root layout
│   └── globals.css              # Global styles
├── components/
│   ├── SceneGallery.tsx         # Scene gallery component
│   └── SceneInfo.tsx            # Scene detail component
├── sanity/
│   ├── schemaTypes/
│   │   └── index.ts             # Project and Scene schemas
│   ├── client.ts                # Sanity client configuration
│   ├── env.ts                   # Environment variables
│   ├── image.ts                 # Image URL builder
│   └── queries.ts               # GROQ queries
└── sanity.config.ts             # Sanity Studio configuration
```

## Getting Started

### 1. Set up Sanity Project

```bash
# If you don't have a Sanity project yet, create one at sanity.io
# Then get your Project ID and Dataset name from Sanity manage
```

### 2. Environment Variables

Create a `.env.local` file in the root directory:

```bash
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id_here
NEXT_PUBLIC_SANITY_DATASET=production
```

### 3. Install Dependencies

```bash
pnpm install
```

### 4. Deploy Schemas to Sanity

```bash
pnpm exec sanity deploy
```

### 5. Run Development Server

```bash
pnpm dev
```

Visit:
- Home page: `http://localhost:3000`
- Projects: `http://localhost:3000/projects`
- Sanity Studio: `http://localhost:3000/studio`

## Data Structure

### Project Document

- **title**: Project name
- **slug**: URL-friendly identifier (auto-generated from title)
- **description**: Project overview
- **date**: Publication date
- **tags**: Array of technology/category tags
- **thumbnail**: Preview image for grid
- **scenes**: Array of references to Scene documents

### Scene Document

- **title**: Scene/step name
- **description**: Scene details or explanation
- **image**: Full resolution scene image
- **order**: Display order within project

## Usage

### Adding Content

1. Visit `http://localhost:3000/studio`
2. Create a new "Project" document
3. Fill in project details and add Scene references
4. Create "Scene" documents with images
5. Publish both documents
6. The portfolio will automatically update

### Customizing Styling

Edit `app/globals.css` and `app/page.tsx` to customize the design. The portfolio uses:
- **Tailwind CSS v4**: Utility-first styling
- **Neutral color palette**: Grays, blacks, and whites
- **Responsive breakpoints**: Mobile-first design

## Deployment

### Вариант A: Деплой на сервере (если билд не зависает)

После `git push origin main`:

```bash
ssh root@82.146.40.70

cd /var/www/portfolio
git fetch --prune origin main
git checkout main
git reset --hard origin/main
git clean -fd -e '.env*'

pkill -f "next build" || true
pnpm install --no-frozen-lockfile
export NODE_OPTIONS=--max-old-space-size=2048
printf "%s" "$(git rev-parse HEAD)" > public/deploy-sha.txt
pnpm build --webpack

pm2 delete portfolio || true
pm2 start "pnpm start -p 3000" --name portfolio --cwd /var/www/portfolio
pm2 save
```

### Вариант B: Pre-built деплой (если билд на VPS зависает)

Собрать локально, упаковать без кэша (scp падает на .pack), залить архив:

```powershell
# 1. Локально: сборка
npm run build:webpack
Remove-Item -Recurse -Force .next\cache, .next\dev -ErrorAction SilentlyContinue
tar -czf next.tar.gz -C .next .
scp next.tar.gz root@82.146.40.70:/var/www/portfolio/
```

```bash
# 2. На сервере (SSH)
cd /var/www/portfolio
git pull origin main
pm2 stop portfolio
rm -rf .next && mkdir .next
tar -xzf next.tar.gz -C .next && rm next.tar.gz
pm2 start portfolio
pm2 save
```

## Technologies Used

- **Next.js 16**: React framework with App Router
- **Sanity CMS**: Headless content management
- **Tailwind CSS v4**: Utility-first CSS framework
- **TypeScript**: Type-safe development
- **Lucide React**: Icon library

## Notes

- The project detail page uses dynamic routes with `generateStaticParams` for optimal build performance
- Images are optimized with Next.js Image component and Sanity image builder
- The scene gallery includes smooth scrolling and active state tracking
