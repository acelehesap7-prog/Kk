'use client''use client'



import * as React from 'react'import * as React from 'react'

import { Slot } from '@radix-ui/react-slot'import { Slot } from '@radix-ui/react-slot'

import { cva, type VariantProps } from 'class-variance-authority'import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'import { cn } from '@/lib/utils'



const buttonVariants = cva(import { cn } from '@/lib/utils'

  'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',

  {const buttonVariants = cva(

    variants: {  'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',

      variant: {

        default: 'bg-primary text-primary-foreground hover:bg-primary/90',  'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',  {

        destructive:

          'bg-destructive text-destructive-foreground hover:bg-destructive/90',  {    variants: {

        outline:

          'border border-input bg-background hover:bg-accent hover:text-accent-foreground',    variants: {      variant: {

        secondary:

          'bg-secondary text-secondary-foreground hover:bg-secondary/80',      variant: {        default:

        ghost: 'hover:bg-accent hover:text-accent-foreground',

        link: 'text-primary underline-offset-4 hover:underline',        default: 'bg-primary text-primary-foreground hover:bg-primary/90',          "bg-primary text-primary-foreground shadow hover:bg-primary/90",

      },

      size: {        destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',        destructive:

        default: 'h-10 px-4 py-2',

        sm: 'h-9 rounded-md px-3',        outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',          "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",

        lg: 'h-11 rounded-md px-8',

        icon: 'h-10 w-10',        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',        outline:

      },

    },        ghost: 'hover:bg-accent hover:text-accent-foreground',          "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",

    defaultVariants: {

      variant: 'default',        link: 'text-primary underline-offset-4 hover:underline',        secondary:

      size: 'default',

    },      },          "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",

  }

)      size: {        ghost: "hover:bg-accent hover:text-accent-foreground",



export interface ButtonProps        default: 'h-10 px-4 py-2',        link: "text-primary underline-offset-4 hover:underline",

  extends React.ButtonHTMLAttributes<HTMLButtonElement>,

    VariantProps<typeof buttonVariants> {        sm: 'h-9 rounded-md px-3',      },

  asChild?: boolean

}        lg: 'h-11 rounded-md px-8',      size: {



const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(        icon: 'h-10 w-10',        default: "h-9 px-4 py-2",

  ({ className, variant, size, asChild = false, ...props }, ref) => {

    const Comp = asChild ? Slot : 'button'      },        sm: "h-8 rounded-md px-3 text-xs",

    return (

      <Comp    },        lg: "h-10 rounded-md px-8",

        className={cn(buttonVariants({ variant, size, className }))}

        ref={ref}    defaultVariants: {        icon: "h-9 w-9",

        {...props}

      />      variant: 'default',      },

    )

  }      size: 'default',    },

)

Button.displayName = 'Button'    },    defaultVariants: {



export { Button, buttonVariants }  }      variant: "default",

)      size: "default",

    },

export interface ButtonProps  }

  extends React.ButtonHTMLAttributes<HTMLButtonElement>,)

    VariantProps<typeof buttonVariants> {

  asChild?: booleanexport interface ButtonProps

}  extends React.ButtonHTMLAttributes<HTMLButtonElement>,

    VariantProps<typeof buttonVariants> {

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(  asChild?: boolean

  ({ className, variant, size, asChild = false, ...props }, ref) => {}

    return (

      <buttonconst Button = React.forwardRef<HTMLButtonElement, ButtonProps>(

        className={cn(buttonVariants({ variant, size, className }))}  ({ className, variant, size, asChild = false, ...props }, ref) => {

        ref={ref}    const Comp = asChild ? Slot : "button"

        {...props}    return (

      />      <Comp

    )        className={cn(buttonVariants({ variant, size, className }))}

  }        ref={ref}

)        {...props}

Button.displayName = 'Button'      />

    )

export { Button, buttonVariants }  }
)
Button.displayName = "Button"

export { Button, buttonVariants }