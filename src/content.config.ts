import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: 'src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    canonicalUrl: z.string().optional(),
    breadcrumbLabel: z.string().optional(),
    tag: z.string().default('Perícia Grafotécnica'),
    h1: z.string(),
    author: z.string().default('Dr. Renato Galotti'),
    datePublished: z.string().optional(),
    dateModified: z.string().optional(),
    dateFormatted: z.string().optional(),
    readingTime: z.string().default('6 min de leitura'),
    heroImgSrc: z.string().optional(),
    heroImgAlt: z.string().optional(),
    ctaTitle: z.string().default('Precisa de um Laudo Grafotécnico com 100% de Aprovação?'),
    ctaDesc: z.string().default('Fale diretamente com o Dr. Renato Galotti pelo WhatsApp e tire suas dúvidas.'),
    ctaWhatsappUrl: z.string().default('https://wa.me/5511976155381?text=Olá%2C+Dr.+Renato+Galotti!+Gostaria+de+solicitar+uma+avaliação+grafotécnica.'),
    order: z.number().default(0)
  })
});

export const collections = { blog };
