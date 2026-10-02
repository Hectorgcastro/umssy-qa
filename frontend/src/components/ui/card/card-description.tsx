import * as React from "react"
import { cn } from "cn"

function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-description"
      className={cn("text-body font-normal text-muted-foreground", className)}
      {...props}
    />
  )
}

export { CardDescription }