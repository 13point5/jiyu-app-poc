import "dotenv/config";
import { SupabaseVectorStore } from "langchain/vectorstores/supabase";
import { createClient } from "@supabase/supabase-js";
import { RetrievalQAChain } from "langchain/chains";
import { ChainTool } from "langchain/tools";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { initializeAgentExecutorWithOptions } from "langchain/agents";
import { VectorStore } from "langchain/dist/vectorstores/base";
import { BaseLanguageModel } from "langchain/base_language";
import { BaseChain } from "langchain/chains";

const getBlockMentions = (query: string) => {
  const blockMentions = [];
  const regex = /<@block:(.*?)>/g;
  let match;
  while ((match = regex.exec(query))) {
    blockMentions.push(match[1]);
  }
  return blockMentions;
};

const privateKey = process.env.NEXT_PUBLIC_SUPABASE_PRIVATE_KEY;
if (!privateKey) throw new Error(`Expected env var SUPABASE_PRIVATE_KEY`);

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
if (!url) throw new Error(`Expected env var SUPABASE_URL`);

const client = createClient(url, privateKey);

const openAIApiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY;
const chatModel = new ChatOpenAI({
  modelName: "gpt-3.5-turbo-0613",
  // modelName: "gpt-3.5-turbo",
  openAIApiKey,
});

type VectorStoreTool = {
  store: VectorStore;
  llm: BaseLanguageModel;
};

// Thanks to baysonic for this: https://github.com/hwchase17/langchainjs/issues/593#issuecomment-1596932147
class CustomTool implements VectorStoreTool {
  store: VectorStore;

  llm: BaseLanguageModel;

  name: string;

  description: string;

  chain: BaseChain;
  returnDirect: boolean;

  constructor(name: string, description: string, fields: VectorStoreTool) {
    this.name = name;
    this.description = description;
    this.store = fields.store;
    this.llm = fields.llm;
    this.returnDirect = true;
    this.chain = RetrievalQAChain.fromLLM(this.llm, this.store.asRetriever(), {
      returnSourceDocuments: true, //The number of source documents returned is 4 by default
    });
  }

  static getDescription(name: string, description: string): string {
    return `${name} - useful for when you need to ask questions about ${description}.`;
  }

  async call(input: string) {
    console.log("input", input);
    //call instead of run
    // return this.chain.run(input);
    return this.chain.call({ query: input });
  }
}

export const chat = async (query: string) => {
  // const query =
  //   "What did jason say about sql injection in <@block:k3u46gu4bg>?";

  const blockMentions = getBlockMentions(query);

  const stores = await Promise.all(
    blockMentions.map((blockId) =>
      SupabaseVectorStore.fromExistingIndex(
        new OpenAIEmbeddings({
          openAIApiKey,
        }),
        {
          client,
          tableName: "documents",
          queryName: "match_documents",
          filter: (rpc) => rpc.eq("metadata->>blockId", blockId),
        }
      )
    )
  );

  const tools = blockMentions.map(
    (blockId, blockIndex) =>
      new CustomTool(
        // `Information about block with id = ${blockId}`,
        blockId,
        `Use this tool to answer questions about block with id = ${blockId}`,
        {
          store: stores[blockIndex],
          llm: chatModel,
        }
      )

    // new ChainTool({
    //   name: `get_info_about_block_${blockId}`,
    //   description: `Use this tool to answer questions about block with id = ${blockId}`,
    //   chain: RetrievalQAChain.fromLLM(
    //     chatModel,
    //     stores[blockIndex].asRetriever(),
    //     {
    //       // returnSourceDocuments: true,
    //     }
    //   ),
    // })
  );

  const executor = await initializeAgentExecutorWithOptions(tools, chatModel, {
    // agentType: "openai-functions",

    // this one works with CustomTool
    agentType: "chat-conversational-react-description",

    // maxIterations: 3,
    verbose: true,
    returnIntermediateSteps: true,
  });

  // return executor.run(query);
  return executor.call({ input: query });
};

// chat();
