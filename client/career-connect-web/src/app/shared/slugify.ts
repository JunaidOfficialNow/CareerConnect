export function slugify(str: string) {
  return str.trim().replace(/\s+/g, '_').toLowerCase()
}