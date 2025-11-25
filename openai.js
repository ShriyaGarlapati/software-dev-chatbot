// openai.js (now actually using Hugging Face)
const { HuggingFaceAPIKey } = require('./config');
//const fetch = require('node-fetch'); // if you're on Node < 18

class OpenAIAPI {
  static async generateResponse(userMessage, conversationHistory = []) {
    const apiKey = HuggingFaceAPIKey;

    // OpenAI-compatible chat completions endpoint on Hugging Face
    const endpoint = 'https://router.huggingface.co/v1/chat/completions';

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        // Pick a chat model that is available on Inference Providers
        // You can change this to any supported model string from HF docs.
        model: 'meta-llama/Meta-Llama-3-8B-Instruct',
        messages: conversationHistory.concat([{ role: 'user', content: userMessage }]),
        max_tokens: 150,
      }),
    });

    const responseData = await response.json();
    console.log('Raw HF response:', responseData);

    if (!response.ok || responseData.error) {
      console.error('HF error:', response.status, response.statusText, responseData.error);
      return 'Sorry, there was an error talking to the model.';
    }

    if (
      Array.isArray(responseData.choices) &&
      responseData.choices.length > 0 &&
      responseData.choices[0].message &&
      typeof responseData.choices[0].message.content === 'string'
    ) {
      return responseData.choices[0].message.content;
    }

    console.error('No valid choices in HF response:', responseData);
    return "Sorry, I couldn't understand that.";
  }
}

module.exports = { OpenAIAPI };
