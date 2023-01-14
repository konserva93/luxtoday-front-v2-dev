import { useCallback } from 'react'
import useSWRInfinite from 'swr/infinite'
import { SWRInfiniteKeyLoader } from 'swr/infinite/dist/infinite'
import { fetcher } from '@/api/sanity'

function useInfiniteLoader<T>(getQuery: SWRInfiniteKeyLoader, pageSize: number) {
  const { data, size, setSize } = useSWRInfinite<T[]>(getQuery, fetcher)

  const posts = data?.flat()
  const isLoading = size > 0 && data && typeof data[size - 1] === 'undefined'
  const isEmpty = data?.[0]?.length === 0
  const isReachingEnd = !isLoading && posts && posts?.length < pageSize * size
  const nextPage = useCallback(() => {
    setSize(size + 1)
  }, [size])

  return { posts, isLoading, isEmpty, isReachingEnd, nextPage}
}

export default useInfiniteLoader
