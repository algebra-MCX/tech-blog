export const site = {
  github: import.meta.env.PUBLIC_GITHUB_URL || 'https://github.com/algebra-MCX',
  x: import.meta.env.PUBLIC_X_URL || '',
  email: import.meta.env.PUBLIC_EMAIL || ''
} as const;
