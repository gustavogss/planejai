interface DividerProps {
  orientation?: 'horizontal' | 'vertical'
  className?: string
  spacing?: number
}

export function Divider({
  orientation = 'horizontal',
  className,
  spacing = 16,
}: DividerProps) {
  const style =
    orientation === 'horizontal'
      ? { marginTop: spacing, marginBottom: spacing }
      : { marginLeft: spacing, marginRigth: spacing }

  const classNamesByOrientation = {
    horizontal: 'w-full h-px',
    vertical: 'self-stretch w-px',
  }
  return (
    <div
      role="separator"
      aria-orientation={orientation}
      style={style}
      className={[classNamesByOrientation[orientation], 'bg-border', className]
        .filter(Boolean)
        .join(' ')}
    ></div>
  )
}
