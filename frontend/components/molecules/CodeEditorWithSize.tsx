'use client';

import { useState } from 'react';
import { DaSelect, DaSelectItem } from '../atoms/DaSelect';
import CodeEditor from './CodeEditor';

interface CodeEditorWithSizeProps {
  code: string;
  onChange: (value: string) => void;
  onBlur: () => void;
  loading?: boolean;
  title?: React.ReactNode;
}

export default function CodeEditorWithSize({
  code,
  onBlur,
  onChange,
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
          setCode={onChange}
          editable={!loading}
        />
      </div>
    </div>
  );
}
