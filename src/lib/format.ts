const timeFormatter = new Intl.DateTimeFormat('en-GB', {
  hour: '2-digit',
  minute: '2-digit',
  hour12: false,
  timeZone: 'Asia/Kolkata',
})

const dayFormatter = new Intl.DateTimeFormat('en-GB', {
  day: '2-digit',
  month: 'short',
  timeZone: 'Asia/Kolkata',
})

export const formatMatchTime = (iso: string) => {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return 'TBC'
  return `${dayFormatter.format(date)} ${timeFormatter.format(date)}`
}

export const formatClock = (iso: string) => {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return 'TBC'
  return timeFormatter.format(date)
}

export const pad = (value: number) => String(value).padStart(2, '0')

export const ordinal = (value: number) => {
  const remainder = value % 100
  if (remainder >= 11 && remainder <= 13) return `${value}th`
  switch (value % 10) {
    case 1:
      return `${value}st`
    case 2:
      return `${value}nd`
    case 3:
      return `${value}rd`
    default:
      return `${value}th`
  }
}

export const createId = (prefix: string) =>
  `${prefix}_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`
