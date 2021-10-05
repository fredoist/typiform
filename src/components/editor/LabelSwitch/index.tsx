import cx from 'classnames'
import { Switch } from '@headlessui/react'

const LabelSwitch = ({
  label,
  checked,
  onChange,
}: {
  label: string
  checked: boolean
  onChange: (value: boolean) => void
}) => (
  <label className="flex items-center justify-between py-2 px-4 hover:bg-gray-100 cursor-pointer transition-colors">
    <span>{label}</span>
    <Switch
      checked={checked}
      onChange={onChange}
      className={cx('relative w-8 h-5 rounded-full transition-colors', {
        'bg-blue-400': checked,
        'bg-gray-400': !checked,
      })}
    >
      <span className="sr-only">Toggle {label} value</span>
      <span
        aria-hidden="true"
        className={cx(
          'absolute left-1 top-1 w-3 h-3 bg-white rounded-full transition-transform',
          {
            'translate-x-3': checked,
          }
        )}
      />
    </Switch>
  </label>
)

export { LabelSwitch }
