import { Component, OnInit, OnDestroy } from '@angular/core';
import { ApiService } from '../api.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { SocketService } from 'app/socket.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  roomCode: string;
  subscriptions: Subscription[] = [];
  socket: any;

  constructor(private apiService: ApiService, private router: Router, private socketService: SocketService) { }

  ngOnInit() {
    this.socket = this.socketService.socket;
    this.socket.on('newRoomId', data => {
      console.log(data);
      this.router.navigateByUrl('/rooms/' + data.roomId);
    });
  }

  logout() {
    this.apiService.logout();
  }

  newRoom() {
    this.socketService.newRoom();
  }

  joinRoom(roomCode: string) {
    this.router.navigateByUrl('/rooms/' + roomCode);
  }

  ngOnDestroy() {
    this.socket.removeAllListeners('newRoomId');
    for (let i = 0; i < this.subscriptions.length; i++) {
      console.log('Unsubscribed: ' + i);
      this.subscriptions[i].unsubscribe;
    }
  }
}
