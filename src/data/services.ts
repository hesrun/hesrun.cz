export const SERVICE_KEYS = ['sites', 'apps', 'motion', 'performance'] as const;
export type ServiceKey = (typeof SERVICE_KEYS)[number];
