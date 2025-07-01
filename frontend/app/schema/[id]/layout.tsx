// Copyright (c) 2025 Eclipse Foundation.
// 
// This program and the accompanying materials are made available under the
// terms of the MIT License which is available at
// https://opensource.org/licenses/MIT.
//
// SPDX-License-Identifier: MIT

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full h-full bg-[#fcfbfc] min-h-[calc(100vh)]">
      {children}
    </div>
  );
}
