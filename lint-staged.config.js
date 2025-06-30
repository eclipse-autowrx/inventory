// Copyright (c) 2025 Eclipse Foundation.
// 
// This program and the accompanying materials are made available under the
// terms of the Apache License, Version 2.0 which is available at
// https://www.apache.org/licenses/LICENSE-2.0.
//
// SPDX-License-Identifier: Apache-2.0

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
