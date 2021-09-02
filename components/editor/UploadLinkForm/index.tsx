import { Button } from 'components/common/Button'
import { useForm } from 'react-hook-form'

interface UploadLinkProps {
  id: string
  onSubmit: (value: string | undefined) => void
}

interface FormResponseProps {
  link: string
}

const UploadLinkForm = ({ id, onSubmit }: UploadLinkProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormResponseProps>()

  return (
    <form
      onSubmit={handleSubmit(async (data) => {
        // rewrite external link to pass through image proxy
        const link = `/api/proxy-image?url=${encodeURIComponent(
          `${data.link}`
        )}`
        onSubmit(link) // return link string to event handler
      })}
    >
      <div className="mt-2 mb-4">
        <label htmlFor={id} className="text-sm text-gray-500">
          Enter an image link
        </label>
        <input
          type="url"
          id={id}
          placeholder="https://"
          required={true}
          autoComplete="off"
          {...register('link', {
            required: {
              value: true,
              message: 'An image link is required',
            },
            pattern: {
              value: /https?:\/\/.*\.(?:png|jpg|jpeg|svg)/i,
              message: 'Please enter a valid image link',
            },
          })}
          className="block w-full mt-2 p-2 border border-gray-200 rounded focus:outline-none focus:border-gray-300 focus:ring-4 focus:ring-black/5"
        />
        {errors && (
          <span className="text-xs text-red-500">{errors.link?.message}</span>
        )}
      </div>
      <Button variant="primary" size="md" type="submit">
        Submit
      </Button>
    </form>
  )
}

export { UploadLinkForm }
