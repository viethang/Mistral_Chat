import React, { useState, useEffect } from 'react';
import MistralClient from '@mistralai/mistralai';
import { marked } from 'marked';
import "./App.css";
function App() {
  const [question, setQuestion] = useState('');
  const [response, setResponse] = useState('');
  let parsedResponse = marked.parse(response, {});

  const handleSubmit = async (event) => {
    event.preventDefault();
    let streamedResponse = '';
    const client = new MistralClient('', "http://localhost:8000");

    const chatStreamResponse = await client.chatStream({
      model: 'mistralai/Mistral-7B-Instruct-v0.2',
      messages: [{role: 'user', content: question}],
    });

    for await (const chunk of chatStreamResponse) {
      if (chunk.choices[0].delta.content !== undefined) {
        const streamText = chunk.choices[0].delta.content;
        streamedResponse += streamText;
        setResponse(streamedResponse);
      }
    }

    setQuestion('');
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Chat with MistralAI</h1>
      </header>
      <main className='app-main'>
        <form onSubmit={handleSubmit}>
          <textarea
            style={{width: "300px", height: "60px"}}
            type="text"
            value={question}
            onChange={(event) => setQuestion(event.target.value)}
            placeholder="Enter your question here..."
          />
          <br/>
          <button type="submit">Submit</button>
        </form>
        <div>
          <h2>Response:</h2>
          <div dangerouslySetInnerHTML={{__html: parsedResponse}}></div>
        </div>
      </main>
    </div>
  );
}

export default App;