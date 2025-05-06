module.exports = {
  // Frontend: Next.js files
  'frontend/**/*.{js,jsx,ts,tsx}': [
    'yarn --cwd frontend eslint --fix --max-warnings=0',
    'npx prettier --write',
  ],
  // Backend: NestJS files
  'backend/**/*.{js,ts}': [
    'yarn --cwd backend eslint --fix --max-warnings=0',
    'npx prettier --write',
  ],
  // Run npm audit on package.json changes
  '{frontend,backend}/package.json': () => ['yarn audit --level=moderate'],
};
