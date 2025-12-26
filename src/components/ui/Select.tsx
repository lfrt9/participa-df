import * as SelectPrimitive from '@radix-ui/react-select'
import { Check, ChevronDown } from 'lucide-react'
import { forwardRef } from 'react'

interface SelectOption {
  value: string
  label: string
  description?: string
}

interface SelectProps {
  id?: string
  value?: string
  onValueChange: (value: string) => void
  options: SelectOption[]
  placeholder?: string
  label?: string
  error?: string
  disabled?: boolean
}

export const Select = forwardRef<HTMLButtonElement, SelectProps>(
  ({ id, value, onValueChange, options, placeholder = 'Selecione...', label, error, disabled }, ref) => {
    const selectId = id || `select-${Math.random().toString(36).slice(2, 9)}`

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={selectId} className="form-label">
            {label}
          </label>
        )}
        <SelectPrimitive.Root value={value} onValueChange={onValueChange} disabled={disabled}>
          <SelectPrimitive.Trigger
            ref={ref}
            id={selectId}
            className={`form-input flex items-center justify-between ${
              error ? 'form-input--error' : ''
            } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={error ? `${selectId}-error` : undefined}
          >
            <SelectPrimitive.Value placeholder={placeholder} />
            <SelectPrimitive.Icon>
              <ChevronDown className="w-5 h-5 text-muted-foreground" />
            </SelectPrimitive.Icon>
          </SelectPrimitive.Trigger>

          <SelectPrimitive.Portal>
            <SelectPrimitive.Content
              className="bg-white rounded-xl border shadow-lg overflow-hidden z-50 min-w-[var(--radix-select-trigger-width)] max-h-[min(300px,var(--radix-select-content-available-height))]"
              position="popper"
              sideOffset={4}
              avoidCollisions={true}
              collisionPadding={16}
            >
              <SelectPrimitive.Viewport className="p-1 max-h-[280px] overflow-y-auto">
                {options.map((option) => (
                  <SelectPrimitive.Item
                    key={option.value}
                    value={option.value}
                    className="relative flex items-center px-4 py-3 rounded-lg cursor-pointer outline-none
                      data-[highlighted]:bg-[hsl(var(--gdf-blue-light))]
                      data-[state=checked]:bg-[hsl(var(--gdf-blue-light))]
                      transition-colors touch-target"
                  >
                    <SelectPrimitive.ItemText>
                      <span className="font-medium">{option.label}</span>
                      {option.description && (
                        <span className="block text-sm text-muted-foreground mt-0.5">
                          {option.description}
                        </span>
                      )}
                    </SelectPrimitive.ItemText>
                    <SelectPrimitive.ItemIndicator className="absolute right-4">
                      <Check className="w-5 h-5 text-[hsl(var(--gdf-blue))]" />
                    </SelectPrimitive.ItemIndicator>
                  </SelectPrimitive.Item>
                ))}
              </SelectPrimitive.Viewport>
            </SelectPrimitive.Content>
          </SelectPrimitive.Portal>
        </SelectPrimitive.Root>
        {error && (
          <p id={`${selectId}-error`} className="form-error" role="alert">
            {error}
          </p>
        )}
      </div>
    )
  }
)

Select.displayName = 'Select'
