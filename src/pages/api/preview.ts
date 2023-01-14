import { NextApiRequest, NextApiResponse } from 'next'
import { previewClient } from '@/api/sanity'
import QueryBuilder from '@/utils/QueryBuilder'

export default async function preview(req: NextApiRequest, res: NextApiResponse) {
  const { secret, slug } = req.query

  if (!secret) {
    return res.status(401).json({ message: 'No secret token' })
  }

  // Check the secret and next parameters
  // This secret should only be known to this API route and the CMS
  if (secret !== process.env.SANITY_PREVIEW_SECRET) {
    return res.status(401).json({ message: 'Invalid secret' })
  }

  if (!slug) {
    return res.status(401).json({ message: 'Invalid slug' })
  }

  const query = new QueryBuilder().where('slug.current', slug as string).fetchOne()
  const exist = await previewClient.fetch(query.build())

  // If the slug doesn't exist prevent preview mode from being enabled
  if (!exist) {
    return res.status(401).json({ message: 'Invalid slug' })
  }

  if (process.env.NODE_ENV === 'production') {
    res.setHeader('Access-Control-Allow-Origin', process.env.BACKEND_ORIGIN as string)
    res.setHeader('Access-Control-Allow-Credentials', 'true')
  }

  // Redirect to the path from the fetched article
  // We don't redirect to req.query.slug as that might lead to open redirect vulnerabilities
  res.setPreviewData({ slug })

  // Redirect to a preview capable route
  res.writeHead(307, { Location: '/preview' })
  res.end()
}
