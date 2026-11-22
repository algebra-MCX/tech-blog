export const site = {
  github: import.meta.env.PUBLIC_GITHUB_URL || 'https://github.com/algebra-MCX',
  x: import.meta.env.PUBLIC_X_URL || 'https://x.com/Shannon20051127',
  linkedin: import.meta.env.PUBLIC_LINKEDIN_URL || 'https://www.linkedin.com/in/chenxi-ma-090923373/',
  email: import.meta.env.PUBLIC_EMAIL || 'shannon20051127@gmail.com',
  homepage: import.meta.env.PUBLIC_HOMEPAGE_URL || 'https://algebra-mcx.github.io/'
} as const;
