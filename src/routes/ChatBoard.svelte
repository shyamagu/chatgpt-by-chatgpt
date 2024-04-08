<script>
    import { onMount } from 'svelte';
  
    let endpoint = '';
    let model = '';
    let apiKey = '';
    let message = '';
    /**
     * @type {any[]}
     */
    let messages = [];
  
    async function sendMessage() {
      const newMessage = { role: 'user', content: message };
      messages = [...messages, newMessage];
  
      const sendData = { endpoint, model, apiKey, messages };
      const response = await fetch('/api/callgpt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sendData),
      });
  
      const receivedData = await response.json();
      const assistantMessage = { role: 'assistant', content: receivedData.message };
      messages = [...messages, assistantMessage];
      message = ''; // Clear the message input after sending
    }
  </script>
  
  <style>
    #chat-board {
      width: 800px;
      display: flex;
      flex-direction: column;
    }
  
    #settings {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      margin-bottom: 20px;
    }
  
    #message-input {
      display: flex;
      align-items: center;
      margin-bottom: 20px;
    }
  
    textarea {
      flex-grow: 1;
      margin-right: 10px;
      height: 150px;
    }
  
    button {
      background-color: #666;
      color: white;
      padding: 10px 20px;
      border: none;
      cursor: pointer;
      height: 150px;
    }
  
    #messages {
      display: flex;
      flex-direction: column;
    }
  
    pre {
        padding: 10px;
        margin: 5px 0;
        border: 1px solid #ccc;
        width: 600px;
        white-space: pre-wrap;  /* CSS3 */
        word-wrap: break-word;  /* Internet Explorer */
    }
  
    .user {
      align-self: flex-start;
      border-color: gray;
    }
  
    .assistant {
      align-self: flex-end;
      background-color: black;
      color: white;
    }
  </style>
  
  <div id="chat-board">
    <div id="settings">
      <input type="text" bind:value={endpoint} placeholder="Endpoint" />
      <input type="text" bind:value={model} placeholder="Model" />
      <input type="password" bind:value={apiKey} placeholder="API Key" />
    </div>
  
    <div id="message-input">
      <textarea bind:value={message} placeholder="Type your message here..."></textarea>
      <button on:click={sendMessage}>Send</button>
    </div>
  
    <div id="messages">
      {#each messages as msg}
        <pre class={msg.role}>{msg.content}</pre>
      {/each}
    </div>
  </div>