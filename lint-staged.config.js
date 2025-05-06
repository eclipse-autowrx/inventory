module.exports = {
  // Frontend: Next.js files
  "frontend/**/*.{js,jsx,ts,tsx}": ["eslint --fix --max-warnings=0", "prettier --write"],
  // Backend: NestJS files
  "backend/**/*.{js,ts}": ["eslint --fix --max-warnings=0", "prettier --write"],
  // Run npm audit on package.json changes
  "{frontend,backend}/package.json": () => ["npm audit --audit-level=moderate"],
}
