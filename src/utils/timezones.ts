export interface TimezoneEntry {
  value: string
  label: string
}

export const TIMEZONES: TimezoneEntry[] = [
  { value: 'UTC-12', label: '(UTC-12:00) International Date Line West' },
  { value: 'UTC-11', label: '(UTC-11:00) Coordinated Universal Time-11' },
  { value: 'UTC-10', label: '(UTC-10:00) Hawaii' },
  { value: 'UTC-9',  label: '(UTC-09:00) Alaska' },
  { value: 'UTC-8',  label: '(UTC-08:00) Pacific Time (US & Canada)' },
  { value: 'UTC-7',  label: '(UTC-07:00) Mountain Time (US & Canada)' },
  { value: 'UTC-6',  label: '(UTC-06:00) Central Time (US & Canada)' },
  { value: 'UTC-5',  label: '(UTC-05:00) Eastern Time (US & Canada)' },
  { value: 'UTC-4',  label: '(UTC-04:00) Atlantic Time (Canada)' },
  { value: 'UTC-3:30', label: '(UTC-03:30) Newfoundland' },
  { value: 'UTC-3',  label: '(UTC-03:00) Brasilia, Buenos Aires' },
  { value: 'UTC-2',  label: '(UTC-02:00) Mid-Atlantic' },
  { value: 'UTC-1',  label: '(UTC-01:00) Azores' },
  { value: 'UTC',    label: '(UTC+00:00) UTC, London, Lisbon' },
  { value: 'UTC+1',  label: '(UTC+01:00) Central European Time' },
  { value: 'UTC+2',  label: '(UTC+02:00) Eastern European Time' },
  { value: 'UTC+3',  label: '(UTC+03:00) Moscow, Istanbul' },
  { value: 'UTC+3:30', label: '(UTC+03:30) Tehran' },
  { value: 'UTC+4',  label: '(UTC+04:00) Dubai, Baku' },
  { value: 'UTC+4:30', label: '(UTC+04:30) Kabul' },
  { value: 'UTC+5',  label: '(UTC+05:00) Pakistan, Tashkent' },
  { value: 'UTC+5:30', label: '(UTC+05:30) India, Sri Lanka' },
  { value: 'UTC+5:45', label: '(UTC+05:45) Kathmandu' },
  { value: 'UTC+6',  label: '(UTC+06:00) Bangladesh, Almaty' },
  { value: 'UTC+6:30', label: '(UTC+06:30) Yangon' },
  { value: 'UTC+7',  label: '(UTC+07:00) Bangkok, Jakarta' },
  { value: 'UTC+8',  label: '(UTC+08:00) Beijing, Singapore' },
  { value: 'UTC+9',  label: '(UTC+09:00) Tokyo, Seoul' },
  { value: 'UTC+9:30', label: '(UTC+09:30) Adelaide' },
  { value: 'UTC+10', label: '(UTC+10:00) Sydney, Melbourne' },
  { value: 'UTC+11', label: '(UTC+11:00) Solomon Islands' },
  { value: 'UTC+12', label: '(UTC+12:00) Fiji, Auckland' },
  { value: 'UTC+13', label: '(UTC+13:00) Samoa' },
  { value: 'UTC+14', label: '(UTC+14:00) Line Islands' },
]

export const DEFAULT_TIMEZONE = 'UTC+1'

export function parseTimezoneOffset(timezone: string): number {
  const match = timezone.match(/UTC([+-])?(\d+)(?::(\d+))?/)
  if (!match) return 0
  const sign = match[1] === '-' ? -1 : 1
  const hours = parseInt(match[2] || '0', 10)
  const minutes = parseInt(match[3] || '0', 10)
  return sign * (hours + minutes / 60)
}

export function convertTimeToTimezone(timeStr: string, fromTimezone: string, toTimezone: string): string {
  const [h, m] = timeStr.split(':').map(Number)
  const fromOffset = parseTimezoneOffset(fromTimezone)
  const toOffset = parseTimezoneOffset(toTimezone)
  const offsetDiff = toOffset - fromOffset
  let totalMinutes = h * 60 + m + offsetDiff * 60
  let newHours = Math.floor(totalMinutes / 60)
  const newMinutes = Math.round(totalMinutes % 60)
  if (newHours >= 24) newHours -= 24
  if (newHours < 0) newHours += 24
  return `${String(newHours).padStart(2, '0')}:${String(newMinutes).padStart(2, '0')}`
}

export function getAvailableTimesInUTC1(date: Date): string[] {
  const day = date.getDay()
  const times: string[] = []

  const range = (start: string, end: string) => {
    const [sh, sm] = start.split(':').map(Number)
    const [eh, em] = end.split(':').map(Number)
    let h = sh, m = sm
    while (h * 60 + m <= eh * 60 + em) {
      times.push(`${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`)
      m += 30
      if (m >= 60) { h++; m -= 60 }
    }
  }

  if (day === 1) { times.push('17:30'); range('18:00', '23:30') }
  else if (day >= 2 && day <= 4) { times.push('15:30'); range('16:00', '23:30') }
  else if (day === 5) { times.push('12:30'); range('13:00', '23:30') }
  else if (day === 6) { range('05:00', '23:30') }
  else if (day === 0) { range('05:00', '22:30') }

  return times
}
