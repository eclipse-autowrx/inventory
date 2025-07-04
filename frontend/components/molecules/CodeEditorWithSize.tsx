// Copyright (c) 2025 Eclipse Foundation.
// 
// This program and the accompanying materials are made available under the
// terms of the MIT License which is available at
// https://opensource.org/licenses/MIT.
//
// SPDX-License-Identifier: MIT

'use client';

import { useState } from 'react';
import { DaSelect, DaSelectItem } from '../atoms/DaSelect';
import CodeEditor, { CodeEditorProps } from './CodeEditor';

interface CodeEditorWithSizeProps extends CodeEditorProps {
  loading?: boolean;
  title?: React.ReactNode;
}

export default function CodeEditorWithSize({
  code,
  onBlur,
  setCode,
  loading,
  title,
}: CodeEditorWithSizeProps) {
  const [fontSize, setFontSize] = useState('12');

  return (
    <div>
      <div className="flex items-center">
        {title && (
          <label
            htmlFor="schema_definition"
            className="block da-txt-small font-medium text-da-gray-medium"
          >
            {title}
          </label>
        )}
        <DaSelect
          wrapperClassName="ml-auto"
          className="h-7 text-xs"
          value={fontSize}
          onValueChange={setFontSize}
        >
          <DaSelectItem className="text-sm" value="10">
            Font size: 10
          </DaSelectItem>
          <DaSelectItem className="text-sm" value="11">
            Font size: 11
          </DaSelectItem>
          <DaSelectItem className="text-sm" value="12">
            Font size: 12
          </DaSelectItem>
          <DaSelectItem className="text-sm" value="13">
            Font size: 13
          </DaSelectItem>
          <DaSelectItem className="text-sm" value="14">
            Font size: 14
          </DaSelectItem>
          <DaSelectItem className="text-sm" value="16">
            Font size: 16
          </DaSelectItem>
          <DaSelectItem className="text-sm" value="18">
            Font size: 18
          </DaSelectItem>
        </DaSelect>
      </div>
      <div className="h-[calc(100vh-320px)] border rounded-md mt-1 p-1">
        <CodeEditor
          language="json"
          fontSize={Number(fontSize)}
          code={code}
          onBlur={onBlur}
          setCode={setCode}
          editable={!loading}
        />
      </div>
    </div>
  );
}
