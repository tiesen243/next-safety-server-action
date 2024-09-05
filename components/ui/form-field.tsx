import { Slot } from '@radix-ui/react-slot'
import * as React from 'react'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

interface FormFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  description?: string
  message?: string[]
  asChild?: boolean
}

const FormField = React.forwardRef<HTMLInputElement, FormFieldProps>(
  ({ label, description, message, className, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : Input

    return (
      <fieldset className={cn('space-y-2', className)}>
        {label && <Label htmlFor={props.name}>{label}</Label>}
        <Comp ref={ref} {...props} />
        {description && <small className="text-xs text-muted-foreground">{description}</small>}
        {message && <small className="text-xs text-destructive">{message}</small>}
      </fieldset>
    )
  },
)

FormField.displayName = 'FormField'

export { FormField }
