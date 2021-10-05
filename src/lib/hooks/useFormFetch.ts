import useSWR from 'swr'

import { fetcher } from 'lib/utils/fetcher'

function useFormFetch(id?: string) {
  const { data, error } = useSWR(`/api/forms/${id}`, fetcher)

  return {
    form: data,
    isLoadingForm: !data && !error,
    formError: error,
  }
}

export { useFormFetch }
