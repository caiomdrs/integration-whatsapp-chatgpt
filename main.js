const axios = require('axios');
const { Client } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

// Token de API OpenAI
api_token = "YOUR API TOKEN HERE"

// Configurações do cliente WhatsApp
const client = new Client();

// Evento de autenticação do cliente WhatsApp
client.on('qr', (qr) => {
    qrcode.generate(qr, { small: true });
    console.log('Escaneie o QR code acima com o seu telefone para se autenticar.');
});

// Evento de inicialização do cliente WhatsApp
client.on('ready', () => {
    console.log('Cliente WhatsApp pronto para enviar e receber mensagens!');
});

// Função para enviar uma solicitação para a API do ChatGPT
async function sendMessage(message) {
  try {
    const response = await axios.post('https://api.openai.com/v1/chat/completions', {
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'system', content: 'You are a helpful assistant.' }, { role: 'user', content: message }]
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${api_token}`
      }
    });

    const { choices } = response.data;
    const reply = choices[0].message.content;
    return reply;
  } catch (error) {
    console.error('Error:', error.response.data);
    throw new Error('Failed to communicate with the ChatGPT API');
  }
}


client.on('message', async (message) => {
    if (message.body) {
        const receivedMessage = message.body
        const response = await get_response(receivedMessage)
        message.reply(response)
    }
})


async function get_response(prompt) {
  const userMessage = prompt;
  try {
    const response = await sendMessage(userMessage);
    console.log('Resposta do ChatGPT:', response);
    return response
  } catch (error) {
    console.error('Erro:', error);
  }
}

client.initialize()
