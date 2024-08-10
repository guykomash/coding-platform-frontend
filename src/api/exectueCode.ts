import axios, { AxiosInstance, AxiosResponse } from 'axios';
const baseURL = 'https://emkc.org/api/v2/piston';

const pistonAPI: AxiosInstance = axios.create({
  baseURL: baseURL,
});

interface runtime {
  language: string;
  version?: string;
}

export const executeCode = async (code: string) => {
  const runtimes = (await pistonAPI.get('/runtimes')).data;
  const version = runtimes.find(
    (rt: runtime) => rt.language == 'javascript'
  ).version;

  const response: AxiosResponse = await pistonAPI.post('/execute', {
    language: 'javascript',
    version: version,
    PISTON_DISABLE_NETWORKING: false,
    files: [
      {
        name: 'code.js',
        content: code,
      },
    ],
  });
  return response;
};
