// import { Editor } from '@monaco-editor/react';

import CodeMirror, { EditorState, minimalSetup } from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';

import {
  syntaxHighlighting,
  defaultHighlightStyle,
} from '@codemirror/language';

import Output from './Output';
import { useEffect, useState } from 'react';

interface CodeEditorProps {
  code: string;
  handleCodeChange: (code: string) => void;
  role: string;
}

const CodeEditor = ({ code, role, handleCodeChange }: CodeEditorProps) => {
  const extensions = [
    minimalSetup({
      syntaxHighlighting: true, // Enables syntax highlighting
    }),
    javascript(),
    syntaxHighlighting(defaultHighlightStyle), // Apply the default syntax highlighting style
    EditorState.readOnly.of(role === 'Mentor'),
  ];

  const [outputCode, setOutputCode] = useState<string>(code);

  const handleLocalCodeChange = (code: string) => {
    setOutputCode(code);
    handleCodeChange(code);
  };

  return (
    <div className="editorDiv">
      <div className="codeDiv">
        <h2>Code</h2>
        <div className="editor">
          <CodeMirror
            // defaultValue={code}
            value={code}
            height="400px"
            onChange={(e) => handleLocalCodeChange(e)}
            extensions={extensions}
            style={{ fontSize: '16px' }}
          />
        </div>
      </div>
      <div className="codeDiv">
        <Output code={outputCode} />
      </div>
    </div>
  );
};

export default CodeEditor;
