import { forwardRef, type InputHTMLAttributes, type TextareaHTMLAttributes } from 'react'
import { AlertCircle } from 'lucide-react'

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  hint?: string
}

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  hint?: string
  maxLength?: number
  showCount?: boolean
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, id, className = '', ...props }, ref) => {
    const inputId = id || `input-${Math.random().toString(36).slice(2, 9)}`
    const errorId = error ? `${inputId}-error` : undefined
    const hintId = hint ? `${inputId}-hint` : undefined

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className="form-label">
            {label}
            {props.required && <span className="text-destructive ml-1" aria-hidden="true">*</span>}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={`form-input ${error ? 'form-input--error' : ''} ${className}`}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={[errorId, hintId].filter(Boolean).join(' ') || undefined}
          {...props}
        />
        {error && (
          <p id={errorId} className="form-error" role="alert">
            <AlertCircle className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
            {error}
          </p>
        )}
        {hint && !error && (
          <p id={hintId} className="form-hint">
            {hint}
          </p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, hint, id, maxLength, showCount = false, value, className = '', ...props }, ref) => {
    const inputId = id || `textarea-${Math.random().toString(36).slice(2, 9)}`
    const errorId = error ? `${inputId}-error` : undefined
    const hintId = hint ? `${inputId}-hint` : undefined
    const charCount = typeof value === 'string' ? value.length : 0

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className="form-label">
            {label}
            {props.required && <span className="text-destructive ml-1" aria-hidden="true">*</span>}
          </label>
        )}
        <div className="relative">
          <textarea
            ref={ref}
            id={inputId}
            value={value}
            maxLength={maxLength}
            className={`form-textarea ${error ? 'form-input--error' : ''} ${className}`}
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={[errorId, hintId].filter(Boolean).join(' ') || undefined}
            {...props}
          />
          {showCount && maxLength && (
            <div
              className="absolute bottom-3 right-3 text-sm text-muted-foreground pointer-events-none"
              aria-live="polite"
              aria-atomic="true"
            >
              <span className={charCount >= maxLength * 0.9 ? 'text-warning' : ''}>
                {charCount}
              </span>
              /{maxLength}
            </div>
          )}
        </div>
        {error && (
          <p id={errorId} className="form-error" role="alert">
            <AlertCircle className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
            {error}
          </p>
        )}
        {hint && !error && (
          <p id={hintId} className="form-hint">
            {hint}
          </p>
        )}
      </div>
    )
  }
)

Textarea.displayName = 'Textarea'
