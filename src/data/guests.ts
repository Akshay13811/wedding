import Papa from 'papaparse'

export type Guest = {
  id: string
  firstName: string
  lastName: string
  fullName: string
  table: string
  customMessage?: string
}

type GuestRow = {
  id?: string
  first_name?: string
  last_name?: string
  table?: string
  custom_message?: string
}

function normalize(s: string) {
  return s.trim().replace(/\s+/g, ' ')
}

export async function loadGuests(): Promise<Guest[]> {
  const url = `${import.meta.env.BASE_URL}data/guests.csv`
  const res = await fetch(url, { cache: 'no-store' })
  if (!res.ok) {
    throw new Error(`Failed to load guests.csv (${res.status})`)
  }
  const csv = await res.text()

  const parsed = Papa.parse<GuestRow>(csv, {
    header: true,
    skipEmptyLines: true,
  })

  if (parsed.errors.length) {
    throw new Error(`Failed to parse guests.csv: ${parsed.errors[0]?.message ?? 'Unknown error'}`)
  }

  const guests: Guest[] = []
  const seen = new Set<string>()

  for (const row of parsed.data) {
    const rawFirst = row.first_name ?? ''
    const rawLast = row.last_name ?? ''
    const rawTable = row.table ?? ''
    const rawCustomMessage = row.custom_message ?? ''
    const firstName = normalize(rawFirst)
    const lastName = normalize(rawLast)
    const fullName = normalize(`${firstName} ${lastName}`.trim())
    const table = normalize(rawTable)
    const customMessage = normalize(rawCustomMessage)
    if (!firstName || !lastName || !table) continue

    const id = normalize(row.id ?? '')
    const finalId = id || `${guests.length + 1}`

    if (seen.has(finalId)) continue
    seen.add(finalId)

    guests.push({ id: finalId, firstName, lastName, fullName, table, customMessage })
  }

  guests.sort((a, b) => a.fullName.localeCompare(b.fullName))
  return guests
}

