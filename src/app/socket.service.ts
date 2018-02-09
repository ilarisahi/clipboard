import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';

@Injectable()
export class SocketService {
  socket: any;
  constructor() {
    this.socket = io();
  }

  newRoom() {
    this.socket.emit('newRoom');
  }

  joinRoom(username: string, roomId: string) {
    this.socket.emit('joinRoom', { username: username, roomId: roomId });
  }

  leaveRoom() {
    this.socket.emit('leaveRoom');
  }

  pasteClipboard(data: any) {
    this.socket.emit('clipboardPaste', { data: data });
  }
}
