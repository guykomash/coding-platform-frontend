import { AxiosResponse } from 'axios';
import axios from '../api/axios';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import CodeEditor from '../components/CodeEditor';
import { checkSolution } from '../socket';

import { io } from 'socket.io-client';

const URL = import.meta.env.VITE_SERVER_API_URL;

const socket = io(URL, {
  forceNew: true,
});

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
  const [studentCounter, setStudentCounter] = useState<number>(1);
  const [role, setRole] = useState<string>('Loading role...');
  const [code, setCode] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [solution, setSolution] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [isSolved, setIsSolved] = useState<boolean>(false);

  useEffect(() => {
    async function fetchCodeBlock() {
      // try {
      const response: AxiosResponse = await axios.get(
        `/codeblock/${codeBlockId}`
      );
      const codeBlock: CodeBlockItem = response?.data?.CodeBlock;
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
    }

    fetchCodeBlock();

    // Socket listeners
    const onOtherCodeChange = (otherCodeChange: { otherCode: string }) => {
      const { otherCode } = otherCodeChange;
      setCode(otherCode);
    };

    const onCodeSolved = () => setIsSolved(true);
    const onRole = (role: string) => setRole(role);
    const onStudentCount = (count: number) => setStudentCounter(count);

    const onMentorDisconn = () => navigate('/');
    socket.on('otherCodeChange', onOtherCodeChange);
    socket.on('codeSolved', onCodeSolved);
    socket.on('role', onRole);
    socket.on('studentCount', onStudentCount);
    socket.on('mentorDisconnected', onMentorDisconn);

    socket.emit('joinRoom', codeBlockId);

    return () => {
      // Remove the listeners.
      socket.off('otherCodeChange', onOtherCodeChange);
      socket.off('codeSolved', onCodeSolved);
      socket.off('role', onRole);
      socket.off('studentCount', onStudentCount);
      socket.off('mentorDisconnected', onMentorDisconn);
      socket.disconnect();
    };
  }, []);

  const onCodeChange = (code: string) => {
    socket.emit('codeChange', {
      roomId: codeBlockId,
      code: code,
    });
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
                      : role === 'Mentor'
                      ? { color: '#5ad25a' }
                      : { color: '#f2f2f2' }
                  }
                >
                  {role}
                </strong>
              </p>
              <p>
                People in room: <strong>{studentCounter}</strong>
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
