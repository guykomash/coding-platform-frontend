export interface CodeBlockItem {
  codeBlockId: string;
  name: string;
  templateCode: string;
  description?: string;
  solution: string;
}

export type CodeBlockItems = CodeBlockItem[];
