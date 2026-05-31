interface PageHeroProps {
  title: string
  subtitle: string
}

export function PageHero({ title, subtitle }: PageHeroProps) {
  return (
    <>
      <h1 className="text-foreground mb-1 text-2xl font-semibold sm:text-3xl">
        {title}
      </h1>
      <p className="text-muted-foreground text:sm mb-8">{subtitle}</p>
    </>
  )
}
