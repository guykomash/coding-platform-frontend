import CodeMirror, {
  EditorState,
  EditorView,
  minimalSetup,
} from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';

import {
  syntaxHighlighting,
  defaultHighlightStyle,
} from '@codemirror/language';

import Output from './Output';
import { useState } from 'react';

interface CodeEditorProps {
  code: string;
  handleCodeChange: (code: string) => void;
  role: string;
}

const CodeEditor = ({ code, role, handleCodeChange }: CodeEditorProps) => {
  const extensions = [
    minimalSetup({
      syntaxHighlighting: true,
    }),
    javascript(),
    syntaxHighlighting(defaultHighlightStyle),
    EditorState.readOnly.of(role === 'Mentor'),
    EditorView.lineWrapping,
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
