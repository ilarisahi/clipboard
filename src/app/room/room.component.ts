import { Component, OnInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { ApiService } from '../api.service';
import { SocketService } from 'app/socket.service';
import { Router, ActivatedRoute } from '@angular/router';
import 'rxjs/add/operator/map';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
import * as helper from './helper.js';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.css']
})
export class RoomComponent implements OnInit {
  @ViewChild('pastedData') pastedDataInput: ElementRef;
  roomId: string;
  subscriptions: Subscription[] = [];
  usernames: string[];
  username: string;
  socket: any;
  copyFunction: any;

  constructor(private apiService: ApiService, private socketService: SocketService, private activatedRoute: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    this.socket = this.socketService.socket;
    console.log(this.subscriptions.length);
    this.username = this.apiService.currentUser()['username'];

    this.subscriptions.push(this.activatedRoute.params.subscribe((data: any) => {
      this.roomId = data.id;
      this.socketService.joinRoom(this.username, data.id);
    }));

    this.socket.on('roomInit', data => {
      console.log(data);
      this.usernames = data.usernames;
    });

    this.socket.on('userJoinedRoom', data => {
      console.log(data);
      this.usernames.push(data);
    });

    this.socket.on('userLeftRoom', data => {
      console.log(data);
      this.usernames = this.usernames.filter(obj => obj !== data);
    });

    this.socket.on('newClipboardPaste', data => {
      console.log(data);
      this.pastedDataInput.nativeElement.value = data;
      this.pastedDataInput.nativeElement.select();
    });

    console.log(helper);
    helper.addListener();
    helper.helper.subscribe(text => {
      console.log(text);
      this.pastedDataInput.nativeElement.value = text;
      this.socketService.pasteClipboard(text);
    });
  }

  leave() {
    this.socketService.leaveRoom();
    this.router.navigateByUrl('/home');
  }

  onPaste($event: any) {
    $event.preventDefault();
    let data = $event.clipboardData.getData('Text');
    this.pastedDataInput.nativeElement.value = data;
    console.log(data);
    this.socketService.pasteClipboard(data);
  }

  copy() {
    this.pastedDataInput.nativeElement.select();
    let success = document.execCommand('Copy');
    console.log('Copy succeeded: ' + success);
  }

  ngOnDestroy() {
    helper.removeListener();
    helper.helper.unsubscribeAll();
    this.socket.removeAllListeners('roomInit');
    this.socket.removeAllListeners('userJoinedRoom');
    this.socket.removeAllListeners('userLeftRoom');
    this.socket.removeAllListeners('newClipboardPaste');
    console.log('Destroying subscriptions.');
    for (let i = 0; i < this.subscriptions.length; i++) {
      this.subscriptions[i].unsubscribe;
    }
  }
}
