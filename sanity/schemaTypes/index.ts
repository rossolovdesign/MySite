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
      name: 'date',
      title: 'Date',
      type: 'datetime',
      description: 'Дата проекта (для сортировки в списке).',
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
      name: 'thumbnail',
      title: 'Thumbnail',
      type: 'image',
      description: 'Картинка для карточки в списке проектов и обложка на детальной странице.',
      options: {
        hotspot: true,
      },
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
      name: 'description',
      title: 'Description',
      type: 'text',
      description: 'Текст сцены. Показывается справа при прокрутке до этой картинки.',
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      description: 'Картинка блока в левой колонке на детальной странице проекта.',
      options: {
        hotspot: true,
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'order',
      title: 'Order',
      type: 'number',
      description: 'Порядок блока на детальной странице (меньше число — выше).',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      media: 'image',
    },
  },
})

export const schemaTypes = [projectType, sceneType]
