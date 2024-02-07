export function CirclesBackground(
  props: React.ComponentPropsWithoutRef<'svg'>,
) {
  return (
    <svg
      viewBox="0 0 1090 1090"
      aria-hidden="true"
      fill="none"
      preserveAspectRatio="none"
      {...props}
    >
      <circle cx={545} cy={545} r="544.5" />
      <circle cx={545} cy={545} r="480.5" />
      <circle cx={545} cy={545} r="416.5" />
      <circle cx={545} cy={545} r="352.5" />
    </svg>
  )
}
