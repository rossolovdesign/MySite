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

### Deploy to Vercel

```bash
git add .
git commit -m "Initial portfolio setup"
git push origin main
```

Then:
1. Go to [vercel.com](https://vercel.com)
2. Import your GitHub repository
3. Add environment variables in project settings
4. Deploy

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
