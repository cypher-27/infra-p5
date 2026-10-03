export function formatDeployDate(date: Date = new Date()): string {
  if (Number.isNaN(date.getTime())) return 'Fecha no disponible';
  return date.toLocaleDateString('es-MX', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}
