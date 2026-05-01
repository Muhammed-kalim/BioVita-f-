import * as React from "react"
import { motion } from "motion/react"
import { cn } from "@/lib/utils"
import { Avatar, AvatarImage } from "@/components/ui/avatar"

export interface TestimonialAuthor {
  name: string
  handle: string
  avatar: string
}

export interface TestimonialCardProps {
  author: TestimonialAuthor
  text: string
  href?: string
  className?: string
  key?: React.Key
}

export function TestimonialCard({ 
  author,
  text,
  href,
  className
}: TestimonialCardProps) {
  const Card = href ? motion.a : motion.div
  
  return (
    <Card
      {...(href ? { href } : {})}
      initial={{ opacity: 0, x: 20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      whileHover={{ x: 5, scale: 1.02 }}
      className={cn(
        "flex flex-col rounded-lg border-t",
        "bg-gradient-to-b from-muted/50 to-muted/10",
        "p-4 text-start sm:p-6",
        "hover:from-muted/60 hover:to-muted/20",
        "max-w-[320px] sm:max-w-[320px]",
        "transition-all duration-300",
        className
      )}
    >
      <div className="flex items-center gap-3">
        <Avatar className="h-12 w-12">
          <AvatarImage src={author.avatar} alt={author.name} />
        </Avatar>
        <div className="flex flex-col items-start">
          <h3 className="text-md font-semibold leading-none">
            {author.name}
          </h3>
          <p className="text-sm text-muted-foreground">
            {author.handle}
          </p>
        </div>
      </div>
      <p className="sm:text-md mt-4 text-sm text-muted-foreground">
        {text}
      </p>
    </Card>
  )
}
