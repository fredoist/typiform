import useSWR from 'swr'
import { fetcher } from 'lib/utils/fetcher'

function useFetchAll(userID: string | null | undefined) {
  const { data, error } = useSWR(`/api/forms/user/${userID}`, fetcher)

  return {
    forms: data,
    error: error,
    isLoading: !data && !error,
  }
}

export { useFetchAll }
