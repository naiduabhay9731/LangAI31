const { Configuration, OpenAIApi } = require("openai");
const fs = require("fs");
const mongoose = require("mongoose");
const langchain = require("langchain/llms/openai");
const { Pinecone } = require("@pinecone-database/pinecone");
const ffmpeg = require("fluent-ffmpeg");
const { VectorDBQAChain } = require("langchain/chains");
const { Document } = require("langchain/document");
const { loadQAMapReduceChain } = require("langchain/chains");
const { response, text } = require("express");
const { ChromaClient } = require("chromadb");
const OpenAI = require("@langchain/openai").OpenAI;
const PineconeStore = require("@langchain/pinecone").PineconeStore;
var path = require("path");
const ConversationalRetrievalQAChain =
  require("langchain/chains").ConversationalRetrievalQAChain;
const { log } = require("console");
const { OpenAIEmbeddings,ChatOpenAI } = require("@langchain/openai");

const RecursiveCharacterTextSplitter =
  require("langchain/text_splitter").RecursiveCharacterTextSplitter;
const express = require("express");

const cors = require("cors");
const { title } = require("process");
const app = express();
require ("dotenv").config();

app.use(cors());
app.use(express.json());

var ytlink;

const naidu = process.env.OPENAI_API_KEY;
const mongoserver = process.env.mongo3+"captions";
const pineconeapi = process.env.pineapi;
const pineconeName= process.env.pineindex;


mongoose.connect(mongoserver);
//Connects backend to mongodb atlas

const transc = {
  title: String,
  text: String,
};
const User = new mongoose.model("caption", transc);
const configuration = new Configuration({
  apiKey: naidu,
});
//Creates openai configuration

var tt = {};
var data3='';
const openai = new OpenAIApi(configuration);


app.post("/", async (req, res) => {
  
   data3=req.body.textData;
   if(data3!=""){
    res.send("Done");
   }
  
  
});

// This post request on submitting button gets the input query which is then used to call the runEmbed()
// function which provides output using langchain openAi and Chroma,which is then passed to the frontend and then displayed
// using react



app.post("/ask", async (req, res) => {
  const ques=req.body.ques;
 
  const answert = await runEmbed(ques);
  res.send(answert);
});
// Transcribes audio4.mp3 file into text and saves it to mongodb and to data.txt.

const runEmbed = async (ques) => {
  

  
  const model = new OpenAI({
    openAIApiKey: naidu,
  });
  //Creates an OpenAI model
  const pinecone = new Pinecone({
    apiKey: pineconeapi,
  });
  

  const data_text = data3;
  
  const textSplit = new RecursiveCharacterTextSplitter({ chunkSize: 1000 });
  //Splits the data.txt text to smaller chunks.
  const doc = await textSplit.createDocuments([data_text]);

  idd = [];
  docData = [];
  docMeta = [];
  var docs = [];
  for (let i = 0; i < doc.length; i++) {
    let idno = "doc" + (i + 1).toString();
    idd.push(idno);
    docData.push(doc[i].pageContent);
    docs.push(
      new Document({
        metadata: { foo: "bar" },
        pageContent: doc[i].pageContent,
      })
    );

    docMeta.push(doc[i].metadata);
  }
 
  const index = pinecone.Index(pineconeName);
  // const info = await pinecone.describeIndex({
  //   indexName: "langai2",
  // });

  const embeddings = new OpenAIEmbeddings({ openAIApiKey: naidu ,model: "text-embedding-3-large"});
  const vectors2 = await embeddings.embedDocuments(docData)
  await PineconeStore.fromDocuments(
    docs,
    new OpenAIEmbeddings({ openAIApiKey: naidu }),
    {
      pineconeIndex: index,
    }
  );
  
  
  var docs2=[];
  for(var i=1;i<docData.length+1;i++){
    docs2.push({
      "id":""+i,
      "values":vectors2[i-1]
    })
  }

  await index.upsert(docs2)
  const vectorStore = await PineconeStore.fromExistingIndex(
    new OpenAIEmbeddings({ openAIApiKey: naidu }),
    { pineconeIndex: index }
  );

  const question2 = ques;
  const retriever = vectorStore.asRetriever()
  const relevantDocs = await retriever.getRelevantDocuments(question2);
 
  const mapReduceChain = loadQAMapReduceChain(model);
  
  const answer = await mapReduceChain.invoke({
    question: question2,
    input_documents: relevantDocs,
  });
 
 
  return answer.text;
  // return  "Hello ";
};


// directory2.closeSync();
const PORT = process.env.PORT || 5000;
app.listen(5000, () => {
  console.log("Server running"+PORT);
});
