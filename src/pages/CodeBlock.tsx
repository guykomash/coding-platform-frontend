import { useEffect, useState } from 'react';

import { useNavigate, useParams } from 'react-router-dom';
import CodeEditor from '../components/CodeEditor';
import { socket, checkSolution } from '../socket';

// Types
import { CodeBlockItem } from '../types';

import '../style.css';

import Smiley from '../assets/Smiley.png';

const CodeBlock = () => {
  const navigate = useNavigate();
  const { codeBlockId } = useParams();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Socket
  const [studentCounter, setStudentCounter] = useState<number>(0);
  const [role, setRole] = useState<string>('loading role...');
  const [code, setCode] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [solution, setSolution] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [isSolved, setIsSolved] = useState<boolean>(false);

  useEffect(() => {
    const initCodeBlock = (codeBlock: CodeBlockItem) => {
      if (!codeBlock) {
        setError('Failed to fetch Code blocks');
        setCode('');
        setName('');
        setLoading(false);
        return;
      }
      const { name, templateCode, description, solution } = codeBlock;
      if (!name || !templateCode) {
        setError('Failed to fetch Code blocks');
        setCode('');
        setName('');
        setLoading(false);
        return;
      }
      // Success.
      setCode(templateCode);
      setName(name);
      setDescription(description ?? '');
      setSolution(solution);
      setError(null);
      setLoading(false);
      return;
    };

    socket.connect();

    // Socket listeners
    socket.on('initCodeBlock', (codeBlock) => initCodeBlock(codeBlock));
    socket.on('codeChange', (code: string) => {
      console.log('codeChangeListener');
      setCode(code);
    });
    socket.on('codeSolved', () => setIsSolved(true));
    socket.on('role', (role: string) => setRole(role));
    socket.on('studentCount', (count: number) => setStudentCounter(count - 1));
    socket.on('mentorDisconnected', () => navigate('/'));

    socket.emit('joinRoom', codeBlockId);

    return () => {
      // Remove the listeners.
      socket.off('initCodeBlock');
      socket.off('codeChange');
      socket.off('codeSolved');
      socket.off('role');
      socket.off('studentCount');
      socket.off('mentorDisconnected');
      socket.disconnect();
    };
  }, []);

  const onCodeChange = (code: string) => {
    console.log('CodeBlock onCodeChange');
    setCode(code);
    socket.emit('codeChange', { roomId: codeBlockId, code: code });
    const isSolved = checkSolution(solution, code);
    setIsSolved(isSolved);
    if (isSolved) {
      socket.emit('codeSolved', codeBlockId);
    }
  };

  return (
    <div className="codeblock">
      <h1 className="codeblockname">
        {error ? (
          'Code Block Was Not Found'
        ) : (
          <>
            <strong>Code Block:&nbsp;&nbsp;</strong> {name}
          </>
        )}
      </h1>

      <button onClick={() => navigate('/')}>Back to Home Page</button>

      {loading ? (
        <h2>loading code block...</h2>
      ) : error ? (
        <div style={{ fontSize: '15px' }}>
          Error getting this Code Block. Maybe it doesn't exist
          <span style={{ fontSize: '20px' }}>🧐.</span>
        </div>
      ) : (
        <>
          {description ? (
            <p style={{ width: '800px', textAlign: 'start', fontSize: '15px' }}>
              <strong>Description: </strong>
              {description}
            </p>
          ) : (
            <></>
          )}
          <div className="platfrom">
            <div className="info">
              <p>
                Connected as:{' '}
                <strong
                  style={
                    role === 'Student'
                      ? { color: '#ffd966' }
                      : { color: '#5ad25a' }
                  }
                >
                  {role}
                </strong>
              </p>
              <p>
                Students in room: <strong>{studentCounter}</strong>
              </p>
            </div>

            {isSolved ? (
              <div className="smileyDiv">
                <img
                  src={Smiley}
                  title="Your code is correct!"
                  alt="code is correct"
                />

                <button onClick={() => setIsSolved(false)}>
                  {' '}
                  Back to Editor
                </button>
              </div>
            ) : (
              <CodeEditor
                code={code}
                handleCodeChange={onCodeChange}
                role={role}
              />
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default CodeBlock;
