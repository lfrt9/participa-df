import { forwardRef } from 'react'
import * as Switch from '@radix-ui/react-switch'

interface ToggleProps {
  checked: boolean
  onCheckedChange: (checked: boolean) => void
  label: string
  description?: string
  id?: string
  disabled?: boolean
}

export const Toggle = forwardRef<HTMLButtonElement, ToggleProps>(
  ({ checked, onCheckedChange, label, description, id, disabled }, ref) => {
    const toggleId = id || `toggle-${Math.random().toString(36).slice(2, 9)}`
    const descriptionId = description ? `${toggleId}-description` : undefined

    return (
      <div className="flex items-start gap-4">
        <Switch.Root
          ref={ref}
          id={toggleId}
          checked={checked}
          onCheckedChange={onCheckedChange}
          disabled={disabled}
          aria-describedby={descriptionId}
          className={`toggle-track ${checked ? 'toggle-track--active' : ''} ${
            disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
          }`}
        >
          <Switch.Thumb
            className={`toggle-thumb ${checked ? 'toggle-thumb--active' : ''}`}
          />
        </Switch.Root>
        <div className="flex-1">
          <label
            htmlFor={toggleId}
            className={`text-base font-medium cursor-pointer ${
              disabled ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {label}
          </label>
          {description && (
            <p id={descriptionId} className="text-sm text-muted-foreground mt-1">
              {description}
            </p>
          )}
        </div>
      </div>
    )
  }
)

Toggle.displayName = 'Toggle'
