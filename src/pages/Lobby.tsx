import { AxiosResponse } from 'axios';
import axios from '../api/axios';
import { useEffect, useState } from 'react';
import { CodeBlockItems } from '../types.ts';

import Palm from '../assets/icon-palm-tree.jpg';

const Lobby = () => {
  const [codeBlocks, setCodeblocks] = useState<CodeBlockItems>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCodeBlocks() {
      try {
        const response: AxiosResponse = await axios.get('/codeblock');
        setCodeblocks(response.data?.CodeBlocks);
        setError(null);
      } catch (err) {
        setCodeblocks([]);
        setError('Failed to fetch Code blocks');
      } finally {
        setLoading(false);
      }
    }

    fetchCodeBlocks();
  }, []);

  return (
    <div className="lobbyDiv">
      <br />
      <img
        src={Palm}
        width="200px"
        height="200px"
        title="Toms Coding Platform"
        alt="suppose to be palm"
        style={{ border: '2px solid black' }}
      />
      <h1>Tom's Coding Platform</h1>
      <h2>Choose Code Block</h2>
      <h3>
        Open the same code block in multiple tabs at the same time to collab in
        real time!
      </h3>
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div>Something went wrong. try again later!</div>
      ) : codeBlocks && codeBlocks.length > 0 ? (
        <div className="lobbyCodeblockGrid">
          {codeBlocks.map((cb) => (
            <div key={cb.codeBlockId}>
              <a href={`codeblock/${cb.codeBlockId}`}>
                <button className="lobbyCodeblockBtn">{cb.name}</button>
              </a>
            </div>
          ))}
        </div>
      ) : (
        <p>Cannot get the code blocks. Try again Later.🔜</p>
      )}
    </div>
  );
};

export default Lobby;
