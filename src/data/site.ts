export const site = {
  github: import.meta.env.PUBLIC_GITHUB_URL || 'https://github.com/',
  x: import.meta.env.PUBLIC_X_URL || 'https://x.com/',
  email: import.meta.env.PUBLIC_EMAIL || 'hello@example.com'
} as const;
