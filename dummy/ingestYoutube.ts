import * as fs from "fs";
import chunksWithSegments from "./chunksWithSegments.json";

import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { Document } from "langchain/document";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import "dotenv/config";
import { SupabaseVectorStore } from "langchain/vectorstores/supabase";
import { createClient } from "@supabase/supabase-js";

const textSplitter = new RecursiveCharacterTextSplitter({
  chunkSize: 500,
  chunkOverlap: 0,
});

const saveChunksWithSegments = async () => {
  const segments = JSON.parse(
    fs.readFileSync("./scripts/segments.json", "utf-8")
  );
  const transcript = fs.readFileSync("./scripts/transcript.txt", "utf-8");
  const transcriptChunks = await textSplitter.createDocuments([transcript]);

  const SEGMENT_OVERLAP_SECONDS = 1;
  const chunksWithSegments = [];

  for (const chunk of transcriptChunks) {
    const chunkText = chunk.pageContent;

    const chunkSegments = [];
    for (const segment of segments) {
      if (
        chunkText
          .trim()
          .toLowerCase()
          .includes(segment.text.trim().toLowerCase())
      )
        chunkSegments.push(segment);
    }

    // Store consecutive segments as one segment
    const consecutiveSegments = [
      {
        start: chunkSegments[0].start,
        end: chunkSegments[0]["end"],
      },
    ];

    for (const segment of chunkSegments.slice(1)) {
      const lastSegmentEnd =
        consecutiveSegments[consecutiveSegments.length - 1].end;

      if (
        segment.start >= lastSegmentEnd &&
        segment.start <= lastSegmentEnd + SEGMENT_OVERLAP_SECONDS
      ) {
        consecutiveSegments[consecutiveSegments.length - 1].end = segment.end;
      } else {
        consecutiveSegments.push({
          start: segment.start,
          end: segment.end,
        });
      }
    }

    chunksWithSegments.push(
      new Document({
        pageContent: chunkText,
        metadata: {
          blockId: "k3u46gu4bg",
          segments: consecutiveSegments,
        },
      })
    );
  }

  fs.writeFileSync(
    "./scripts/chunksWithSegments.json",
    JSON.stringify(chunksWithSegments, null, 2)
  );
};

const privateKey = process.env.SUPABASE_PRIVATE_KEY;
if (!privateKey) throw new Error(`Expected env var SUPABASE_PRIVATE_KEY`);

const url = process.env.SUPABASE_URL;
if (!url) throw new Error(`Expected env var SUPABASE_URL`);

const ingest = async () => {
  const client = createClient(url, privateKey);

  await SupabaseVectorStore.fromDocuments(
    chunksWithSegments.map(
      (chunk) =>
        new Document({
          pageContent: chunk.pageContent,
          metadata: chunk.metadata,
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

const query = async () => {
  const client = createClient(url, privateKey);

  const store = await SupabaseVectorStore.fromExistingIndex(
    new OpenAIEmbeddings(),
    {
      client,
      tableName: "documents",
      queryName: "match_documents",
    }
  );

  const res = await store.similaritySearch("sql injection", 3);

  console.log(res);
};

// query();
