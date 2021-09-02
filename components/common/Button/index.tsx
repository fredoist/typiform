import * as React from 'react'
import cx from 'classnames'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant: 'primary' | 'disabled' | 'default'
  size: 'xs' | 'sm' | 'md' | 'lg'
  children: React.ReactNode
}

const Button = ({
  variant,
  size,
  children,
  onClick,
  ...props
}: ButtonProps) => {
  // define button clases
  const commonClases = `inline-block rounded flex items-center gap-2 border border-transparent focus:outline-none focus:ring-4 transition-colors`
  const Variants = {
    primary: `bg-red-500 text-white focus:ring-red-500/25 focus:border-red-700 hover:bg-red-700`,
    default: `bg-white text-gray-700 focus:ring-gray-600/10 focus:border-gray-300 hover:bg-gray-100`,
    disabled: `bg-gray-100 text-gray-500 focus:ring-0 cursor-not-allowed`,
  }
  const Sizes = {
    xs: 'py-1 px-1 text-xs uppercase font-semibold',
    sm: 'py-1 px-1 text-sm font-semibold',
    md: 'py-2 px-2 text-base font-bold',
    lg: 'py-2 px-3 text-lg font-bold',
  }

  return (
    <button
      className={cx(commonClases, Variants[variant], Sizes[size])}
      disabled={variant === 'disabled'}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  )
}

export { Button }
