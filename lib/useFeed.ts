'use client'

import useSWRInfinite from 'swr/infinite'

const fetcher = (url: string) => fetch(url).then(r => r.json())

export function useFeed(limit = 20) {
  return useSWRInfinite(
    (pageIndex, previousPage) =>
      previousPage && previousPage.length < limit
        ? null
        : `/api/messages?limit=${limit}&cursor=${
            previousPage?.[previousPage.length - 1]?.id ?? ''
          }`,
    fetcher,
    { revalidateAll: false }
  )
}
