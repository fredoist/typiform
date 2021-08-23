import { useForm } from 'react-hook-form'

interface FormData {
  link: string
}

const UploadLinkForm = ({
  id,
  onSubmit,
}: {
  id: string
  onSubmit: (value: string) => void
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>()

  return (
    <form
      onSubmit={handleSubmit((data: FormData) => {
        onSubmit(data.link)
      })}
    >
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
        className="block w-full mt-2 p-2 border border-gray-200 rounded focus:outline-none focus:border-gray-300 focus:ring-2 focus:ring-black/5"
      />
      {errors && (
        <span className="text-xs text-red-500">{errors.link?.message}</span>
      )}
      <button type="submit" className="btn btn-primary mt-4">
        Submit
      </button>
    </form>
  )
}

export { UploadLinkForm }
