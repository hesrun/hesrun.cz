export const SERVICE_KEYS = ['sites', 'apps', 'ai', 'motion', 'performance'] as const;
export type ServiceKey = (typeof SERVICE_KEYS)[number];
