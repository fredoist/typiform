import { fetcher } from 'lib/utils/fetcher'
import useSWR from 'swr'

function useResponses(formID: string) {
  const { data, error } = useSWR(`/api/forms/${formID}/responses`, fetcher)

  return {
    responses: data,
    responsesError: error,
    isLoadingResponses: !data && !error,
  }
}

export { useResponses }
