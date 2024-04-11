import React, { useState } from "react";
import "./Ask.css";
import axios from "axios";

const QuestionAnswer = () => {
  const [inputQues, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [outputData, setOutputData] = useState("");
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);
  const [data, setData] = useState("");
  const [data2, setData2] = useState("");

  const handleFileChange = (e) => {
    console.log(e);
    const file2 = e.target.files[0];
    console.log(file2);
    setFile(file2);
    console.log(file);
  };
  const ReadFile = async (file) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      // Handle different file types (text or PDF)
      if (file.type === "text/plain") {
        setData(event.target.result);
        console.log(data);
      } else if (file.type === "application/pdf") {
        // Handle PDF file
        // You may need to use a library like pdf.js to handle PDF files
        console.log("PDF file selected");
      } else {
        console.error("Unsupported file type");
      }
    };
    reader.readAsText(file); // Read the file as text
  };

  const submitData = async () => {
    if (file != null) {
      console.log(file);
      await ReadFile(file);
    } else {
      setData(data2);
    }
    try {
      const response = await axios.post("http://localhost:5000/", {
        textData: data,
      });
      console.log(response);
      setOutputData(response.data);
      setLoading(false);
      if (response.status === 200) {
        window.location.href = '/ask';
      } else {
        console.log('Request failed with status:', response.status);
      }
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div className="container">
      <h1>Ask Page</h1>
      <label className="label">Submit Text or Upload a text file</label>
      <div className="inputs-container">
        <input
          className="file-input"
          type="file"
          accept=".txt"
          onChange={handleFileChange}
          disabled={data2 !== ""}
        />
        <input
          className="input"
          type="text"
          value={data2}
          onChange={(e) => setData2(e.target.value)}
          disabled={file !== null}
        />
      </div>
      <button onClick={submitData} type="submit">
        Publish
      </button>
    </div>
  );
};

const Ask = () => {
  return (
    <div>
      <QuestionAnswer />
    </div>
  );
};

export default Ask;
