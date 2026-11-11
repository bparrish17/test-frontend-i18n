import Pusher from 'pusher-js';
import { PUSHER_APP_CONFIG } from '@util/constants';

export default class PusherService {
  static serviceInstance = null;

  constructor() {
    this.pusher = new Pusher(import.meta.env.VITE_PUSHER_APP_KEY, PUSHER_APP_CONFIG);
    this.getChannel.bind(this);
    this.subscribe.bind(this);
    this.unsubscribe.bind(this);
    this.bindToEventOnChannel.bind(this);
    this.unbindFromEventOnChannel.bind(this);
    this.channels = {};
  }

  static getInstance() {
    if (PusherService.serviceInstance == null) {
      PusherService.serviceInstance = new PusherService();
    }
    return this.serviceInstance;
  }

  getChannel(channelId) {
    return this.channels[channelId];
  }

  subscribe(channelId) {
    let channel = this.getChannel(channelId);
    if (!channel) {
      channel = this.pusher.subscribe(channelId);
    }
    this.channels[channelId] = channel;
    return this.channels[channelId];
  }

  unsubscribe(channelId) {
    const channel = this.getChannel(channelId);
    if (channel) {
      this.pusher.unsubscribe(channelId);
      delete this.channels[channelId];
    }
  }

  bindToEventOnChannel(channelId, eventName, listener) {
    const channel = this.getChannel(channelId);
    if (!channel) {
      this.subscribe(channelId);
    }
    this.getChannel(channelId).bind(eventName, listener);
  }

  unbindFromEventOnChannel(channelId, eventName) {
    const channel = this.getChannel(channelId);
    if (!channel) return;
    this.getChannel(channelId).unbind(eventName);
  }
}
