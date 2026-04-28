import sourcesData from '../../data/sources.json';

export type Source = (typeof sourcesData)[number];

export const sources = sourcesData;
export const sourceById = new Map(sources.map((source) => [source.id, source]));

export function getSources(sourceIds: string[] = []): Source[] {
  return sourceIds
    .map((sourceId) => sourceById.get(sourceId))
    .filter((source): source is Source => Boolean(source));
}

export function sourceTypeLabel(sourceType: string | null | undefined): string {
  if (!sourceType) return 'Not sourced';
  return sourceType
    .split('_')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}
