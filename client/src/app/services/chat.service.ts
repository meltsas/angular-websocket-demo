import { Observable } from 'rxjs/Observable';
import * as io from 'socket.io-client';
import {environment} from "../../environments/environment";


export class ChatService {
  private url = environment.wsURI;
  private socket;

  sendMessage(message) {
    this.socket.emit('add-message', message);
  }

  sendTypingMessage(message) {
    this.socket.emit('typing', message);
  }

  getMessages() {
    let observable = new Observable(observer => {
      this.socket = io(this.url);
      this.socket.on('message', (data) => {
        observer.next(data);
      });
      return () => {
        this.socket.disconnect();
      }
    })
    return observable;
  }

}
