import sanityClient from '@sanity/client'
import imageUrlBuilder from '@sanity/image-url'

const sanityConfig = {
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: '2021-08-31',
  useCdn: true,
}

const client = sanityClient(sanityConfig)

export const previewClient = sanityClient({
  ...sanityConfig,
  useCdn: false,
  token: process.env.SANITY_API_READ_TOKEN,
})

export const imageBuilder = imageUrlBuilder(client)

export function fetcher<T>(query: string) {
  return client.fetch(query) as T
}
