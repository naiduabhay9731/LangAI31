//import logo from './logo.svg';
import './InputOutput.css';
import React, { useState } from "react";
import axios from "axios";

function InputOutput() {
 
  const [inputTitle,setInputTitle]=useState('');
  
  const [output,setOutput]=useState('');

 
  const handleTitleChange = (event) => {
    setInputTitle(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    

    
    try{const response = await axios.post('https://langai31.onrender.com/ask',{ques:inputTitle});
   
    
    // setOutputData(response.data);
    if (response.status === 200) {
      setOutput(response.data);
      
    } else {
      console.log('Request failed with status:', response.status);
    }
  
  }catch(e){
      console.log(e);
    }


    // var jsonResponse = await response;
    // setOutputData(jsonResponse.outputData);
  };

  return (
    <div className="container">
      <h1 className="title">LANGAI</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title" className="label">Ask Your Question:</label>
          <input
            type="text"
            id="title"
            value={inputTitle}
            onChange={handleTitleChange}
            className="input"
          />
        </div>
        <button type="submit" className="submit-btn">Submit</button>
      </form>
      <div>
      <label htmlFor="title" className="label">Output: </label>
      <div className="output">{output}</div>
      </div>
    </div>
  )
}

export default InputOutput;
