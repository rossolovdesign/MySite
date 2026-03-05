import { defineField, defineType } from 'sanity'

export const projectType = defineType({
  name: 'project',
  title: 'Project',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'Заголовок проекта. Показывается в правой колонке на детальной странице.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'titleEn',
      title: 'Title (EN)',
      type: 'string',
      description: 'Английский заголовок проекта (для /en).',
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      description: 'URL-адрес страницы проекта (например, my-project). Генерируется из заголовка.',
      options: {
        source: 'title',
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'shortDescription',
      title: 'Краткое описание',
      type: 'string',
      description: 'Текст для карточки проекта в списке проектов (/projects). На детальной странице не показывается.',
    }),
    defineField({
      name: 'shortDescriptionEn',
      title: 'Краткое описание (EN)',
      type: 'string',
      description: 'Английский текст карточки проекта (для /en/projects).',
    }),
    defineField({
      name: 'date',
      title: 'Date',
      type: 'datetime',
      description: 'Дата проекта (отображается на карточке).',
    }),
    defineField({
      name: 'order',
      title: 'Порядок',
      type: 'number',
      description: 'Порядок отображения в списке проектов. Меньше = выше. Например: 1 — первый, 2 — второй. Если не указано — сортировка по дате.',
      validation: (rule) => rule.min(0).integer(),
    }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Бейджи (теги) проекта. Показываются на карточке в списке и на детальной странице.',
      options: {
        layout: 'tags',
      },
    }),
    defineField({
      name: 'tagsEn',
      title: 'Tags (EN)',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Английские теги проекта (если нужны отдельные от RU).',
      options: {
        layout: 'tags',
      },
    }),
    defineField({
      name: 'thumbnail',
      title: 'Thumbnail',
      type: 'image',
      description: 'Картинка для карточки в списке проектов и обложка на детальной странице.',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'collaboration',
      title: 'Совместно с',
      type: 'object',
      description:
        'Опциональный блок для карточки проекта: "Совместно с" + ссылка на партнера/студию.',
      fields: [
        defineField({
          name: 'url',
          title: 'URL',
          type: 'url',
          description: 'Ссылка на сайт/профиль партнера.',
        }),
        defineField({
          name: 'titleRu',
          title: 'Заголовок (RU)',
          type: 'string',
          description: 'Текст ссылки для русской версии.',
        }),
        defineField({
          name: 'titleEn',
          title: 'Заголовок (EN)',
          type: 'string',
          description: 'Текст ссылки для английской версии.',
        }),
      ],
    }),
    defineField({
      name: 'scenes',
      title: 'Scenes',
      type: 'array',
      description: 'Блоки с картинками в левой колонке. При скролле справа подставляются заголовок и описание выбранной сцены.',
      of: [{ type: 'reference', to: [{ type: 'scene' }] }],
    }),
  ],
  preview: {
    select: {
      title: 'title',
      media: 'thumbnail',
    },
  },
})

export const sceneType = defineType({
  name: 'scene',
  title: 'Scene',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'Заголовок сцены. Показывается справа при прокрутке до этой картинки.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'titleEn',
      title: 'Title (EN)',
      type: 'string',
      description: 'Английский заголовок сцены (для /en).',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      description: 'Текст сцены. Показывается справа при прокрутке до этой картинки.',
    }),
    defineField({
      name: 'descriptionEn',
      title: 'Description (EN)',
      type: 'text',
      description: 'Английский текст сцены (для /en).',
    }),
    defineField({
      name: 'mediaType',
      title: 'Тип медиа',
      type: 'string',
      initialValue: 'image',
      options: {
        list: [
          { title: 'Image / Photo', value: 'image' },
          { title: 'GIF', value: 'gif' },
          { title: 'Lottie (JSON)', value: 'lottie' },
        ],
        layout: 'radio',
      },
      description: 'Выберите тип контента для сцены: фото, GIF или Lottie.',
    }),
    defineField({
      name: 'mediaFile',
      title: 'Media File',
      type: 'file',
      options: {
        accept: '.json,application/json,image/*,.gif,image/gif',
      },
      description: 'Единое поле файла для Image/GIF/Lottie JSON в зависимости от выбранного типа медиа.',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      media: 'mediaFile',
      mediaType: 'mediaType',
      mediaFileAsset: 'mediaFile.asset',
    },
    prepare(selection) {
      const { title, mediaType, mediaFileAsset, media } = selection as {
        title?: string
        mediaType?: string
        mediaFileAsset?: unknown
        media?: unknown
      }

      const resolvedType =
        mediaType === 'lottie'
          ? 'Lottie'
          : mediaType === 'gif'
            ? 'GIF'
            : mediaType === 'image' || mediaFileAsset || media
              ? 'Image'
              : 'Image'

      return {
        title: title || 'Untitled scene',
        subtitle: `Type: ${resolvedType}`,
        media,
      }
    },
  },
})

export const schemaTypes = [projectType, sceneType]
