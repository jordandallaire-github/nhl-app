export function generatePlayerSlug(firstName: string, lastName: string, id: string): string {
    return `${firstName.toLowerCase().replace(/\s+/g, '-')}-${lastName.toLowerCase().replace(/\s+/g, '-')}-${id}`;
  }
  