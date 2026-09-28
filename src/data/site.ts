export const site = {
  github: import.meta.env.PUBLIC_GITHUB_URL || 'https://github.com/algebra-MCX',
  x: import.meta.env.PUBLIC_X_URL || 'https://x.com/Shannon20051127',
  email: import.meta.env.PUBLIC_EMAIL || 'shannon20051127@gmail.com',
  curriculum: import.meta.env.PUBLIC_CV_URL || 'https://algebra-mcx.github.io/Academic-Profile/Work/cv/'
} as const;
