import Axios from 'axios';

export default class RecallService {
  static serviceInstance = null;

  constructor() {
    this.baseURL = '/recall';
  }

  static getInstance() {
    if (RecallService.serviceInstance == null) {
      RecallService.serviceInstance = new RecallService();
    }
    return this.serviceInstance;
  }

  ask(data) {
    return Axios({
      method: 'POST',
      url: `${this.baseURL}/bots/ask`,
      data
    });
  }

  // {
  //     "prompt": "Please draw a ... .", // Required: up to 4000 characters
  //     "model": "dall-e-3",  // Required: only accepts dall-e-3 .
  //     "n": 1,  // Optional: if supplied can only be 1.
  //     "quality": "hd",  // Optional: hd or standard
  //     "response_format": "url",  // Required: b64_json or url
  //     "size": "Wide",  // Optional: Tall, Wide, or Square - defaults to Square.
  //     "style": "natural" // Optional: natural or vivid
  //   }

  draw(data) {
    return Axios({
      method: 'POST',
      url: `${this.baseURL}/draw`,
      data
    });
  }

  getTranscripts(searchTerm) {
    return Axios({
      method: 'GET',
      url: `${this.baseURL}/bots/transcripts?term=${searchTerm}&size=1`
    });
  }

  getBots(body) {
    return Axios({
      method: 'POST',
      url: `${this.baseURL}/bots/search`,
      data: body
    });
  }

  getBotById(botId) {
    return Axios({
      method: 'GET',
      url: `${this.baseURL}/bots/${botId}`
    });
  }

  createBot(bot) {
    return Axios({
      method: 'POST',
      url: `${this.baseURL}/bots`,
      data: bot
    });
  }

  createReplayBot(srcId, destId) {
    return Axios({
      method: 'POST',
      url: `${this.baseURL}/bots/${srcId}/replay/${destId}`,
      data: { srcId, destId }
    });
  }

  createReplayBotNew(id, rate = 1) {
    return Axios({
      method: 'POST',
      url: `${this.baseURL}/bots/${id}/replay`,
      data: { id, rate }
    });
  }

  uploadBot(botId, data) {
    return Axios({
      method: 'PUT',
      url: `${this.baseURL}/bots/${botId}`,
      data: { url: `http://localhost:3000/bots/${botId}`, ...data }
    });
  }

  askBot(botId, body) {
    return Axios({
      method: 'POST',
      url: `${this.baseURL}/bots/${botId}/ask`,
      data: body
    });
  }

  sendChat(message, botId) {
    return Axios({
      method: 'POST',
      url: `${this.baseURL}/bots/${botId}/chat`,
      data: {
        to: 'everyone',
        message
      }
    });
  }

  createZoomOAuthCredential(code, redirectUri) {
    return Axios({
      method: 'POST',
      url: `${this.baseURL}/zoom/credential`,
      data: { code, redirect_uri: redirectUri }
    }).then((res) => res.data);
  }

  leaveBot(botId) {
    return Axios({
      method: 'DELETE',
      url: `${this.baseURL}/bots/${botId}/leave`
    });
  }

  async generateTitle(values) {
    const templateTitleRes = await this.ask({
      prompt:
        'Please give this conversation a descriptive title based on the theme of its contents using three words maximum. Try to select something unique, there might be many conversations with similar titles and we wish to avoid collisions.',
      values
    });

    return templateTitleRes.data.choices[0].message.content;
  }
}
