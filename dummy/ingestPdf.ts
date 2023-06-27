import * as fs from "fs";
import chunksWithSegments from "./chunksWithSegments.json";

import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { Document } from "langchain/document";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import "dotenv/config";
import { SupabaseVectorStore } from "langchain/vectorstores/supabase";
import { createClient } from "@supabase/supabase-js";
import { PDFLoader } from "langchain/document_loaders/fs/pdf";

const privateKey = process.env.SUPABASE_PRIVATE_KEY;
if (!privateKey) throw new Error(`Expected env var SUPABASE_PRIVATE_KEY`);

const url = process.env.SUPABASE_URL;
if (!url) throw new Error(`Expected env var SUPABASE_URL`);

const filePath = "/home/bharath/Documents/Learning Theories_ Cognitivism.pdf";

const client = createClient(url, privateKey);

const ingest = async () => {
  const loader = new PDFLoader(filePath);

  const docs = await loader.load();
  console.log("docs", docs);

  await SupabaseVectorStore.fromDocuments(
    docs.map(
      (doc) =>
        new Document({
          pageContent: doc.pageContent,
          metadata: { blockId: "pdf_cognitivism", ...doc.metadata },
        })
    ),
    new OpenAIEmbeddings(),
    {
      client,
      tableName: "documents",
      queryName: "match_documents",
    }
  );

  console.log("Ingested");
};

ingest();
