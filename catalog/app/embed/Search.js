import * as React from 'react'
import { useLocation, useParams } from 'react-router-dom'
import * as M from '@material-ui/core'

import * as SearchResults from 'components/SearchResults'
import * as Data from 'utils/Data'
import * as NamedRoutes from 'utils/NamedRoutes'
import parseSearch from 'utils/parseSearch'
import useSearch from 'utils/search'

function Results({ bucket, query, page, makePageUrl, retry, retryUrl, scrollRef }) {
  // TODO: use GQL to fetch search results
  const data = Data.use(useSearch(), { buckets: [bucket], query, retry })
  return data.case({
    _: () => (
      <SearchResults.Progress>
        Searching s3://{bucket} for &quot;{query}&quot;
      </SearchResults.Progress>
    ),
    Err: SearchResults.handleErr(retryUrl),
    Ok: ({ total, hits }) =>
      total ? (
        <SearchResults.Hits {...{ hits, page, scrollRef, makePageUrl }} />
      ) : (
        <SearchResults.NothingFound />
      ),
  })
}

export default function Search() {
  const { bucket } = useParams()
  const l = useLocation()
  const { urls } = NamedRoutes.use()
  const { q: query = '', p, ...params } = parseSearch(l.search)
  const page = p && parseInt(p, 10)
  const retry = (params.retry && parseInt(params.retry, 10)) || undefined
  const makePageUrl = React.useCallback(
    (newP) =>
      urls.bucketSearch(bucket, { q: query, p: newP !== 1 ? newP : undefined, retry }),
    [urls, bucket, query, retry],
  )
  const retryUrl = urls.bucketSearch(bucket, { q: query, retry: (retry || 0) + 1 })
  const scrollRef = React.useRef(null)
  return (
    <M.Box pb={{ xs: 0, sm: 5 }} mx={{ xs: -2, sm: 0 }}>
      <M.Box position="relative" top={-80} ref={scrollRef} />
      <Results {...{ bucket, query, page, makePageUrl, retry, retryUrl, scrollRef }} />
    </M.Box>
  )
}
