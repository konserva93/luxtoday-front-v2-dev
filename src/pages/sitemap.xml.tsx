import queries from '@/api'
import { fetcher } from '@/api/sanity'
import { GetServerSidePropsContext } from 'next'

export default function SiteMap() {
  return <div>loading</div>
}

export async function getServerSideProps({
  res,
  locales,
  defaultLocale,
}: GetServerSidePropsContext) {
  const nodes = await fetcher<any[]>(queries.common.getSitemap())

  const urls = nodes.map(({ slug, type, category, theme, stage, locale1, locale2, guideStage }) => {
    switch (type) {
      case 'news':
      case 'interview':
        return {
          loc: `/${type}/${category}/${slug}`,
          changefreq: 'monthly',
          priority: 0.7,
          locale: locale2,
        }
      case 'guideArticles':
        return {
          loc: `/guide/${stage}/${theme}/${slug}`,
          changefreq: 'monthly',
          priority: 0.7,
          locale: locale1,
        }
      case 'guideThemes':
        return {
          loc: `/guide/${guideStage}/${slug}`,
          changefreq: 'weekly',
          priority: 0.8,
          locale: locale1,
        }
      case 'guideStages':
        return {
          loc: `/guide/${slug}`,
          changefreq: 'weekly',
          priority: 0.8,
          locale: locale1,
        }
      case 'guideStages':
        return {
          loc: `/guide/${slug}`,
          changefreq: 'weekly',
          priority: 0.8,
          locale: locale1,
        }
      case 'headings':
        return {
          loc: `/news/${slug}`,
          changefreq: 'daily',
          priority: 0.9,
          locale: locale1,
        }
      case 'interviewHeadings':
        return {
          loc: `/interview/${slug}`,
          changefreq: 'daily',
          priority: 0.9,
          locale: locale1,
        }
      default:
        return {}
    }
  })

  const pages = [
    { loc: '/privacy-policy', priority: 0.5, changefreq: 'yearly' },
    { loc: '/', priority: 1, changefreq: 'hourly' },
  ]

  locales?.forEach((locale) => {
    pages.forEach((page) => {
      urls.unshift({ ...page, locale })
    })
  })

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${urls
        .map(
          ({ loc, changefreq, priority, locale }) =>
            loc &&
            locales?.includes(locale) &&
            `
        <url>
          <loc>${
            process.env.NEXT_PUBLIC_ORIGIN + (locale === defaultLocale ? '' : `/${locale}`) + loc
          }</loc>
          <changefreq>${changefreq}</changefreq>
          <priority>${priority}</priority>
        </url>
      `
        )
        .join('')}
      
    </urlset>
    `
  res.setHeader('Content-Type', 'text/xml')
  res.setHeader(
    'Cache-Control',
    'public, s-maxage=3600, stale-while-revalidate=59'
  )
  res.write(sitemap)
  res.end()
  return {
    props: {},
  }
}
