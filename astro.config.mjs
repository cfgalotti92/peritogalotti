import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://peritogalotti.com.br',
  trailingSlash: 'always',
  build: {
    format: 'directory',
    inlineStylesheets: 'always'
  },
  integrations: [
    sitemap({
      filter: (page) => !page.includes('/404')
    })
  ],
  redirects: {
    '/sobre.html': '/sobre/',
    '/servicos.html': '/servicos/',
    '/casos.html': '/casos/',
    '/faq.html': '/faq/',
    '/contato.html': '/contato/',
    '/blog/o-que-e-pericia-grafotecnica.html': '/blog/o-que-e-pericia-grafotecnica/',
    '/blog/quanto-custa-pericia-grafotecnica.html': '/blog/quanto-custa-pericia-grafotecnica/',
    '/blog/pericia-grafotecnica-assinatura-falsa.html': '/blog/pericia-grafotecnica-assinatura-falsa/',
    '/blog/pericia-grafotecnica-processo-civil.html': '/blog/pericia-grafotecnica-processo-civil/'
  }
});
