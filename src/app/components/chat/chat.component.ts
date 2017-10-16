import { Component, EventEmitter, Input, ElementRef, ViewChild, AfterViewChecked, DoCheck } from '@angular/core';

import { WebsocketService } from '../../services/websocket.service';
import Utils from '../../utils';

@Component({
  selector: 'chat',
  templateUrl: 'chat.component.html',
  styleUrls: [ 'chat.component.scss' ]
})
export class ChatComponent implements AfterViewChecked, DoCheck {

  private totalMsgs: number = 0;
  private toScroll: boolean;
  private wasTyping: boolean = false;
  private userInput = '';

  @Input() private emitterType;
  @Input() private recipient;
  @Input() private messages;
  @ViewChild('convTainer') private convTainer: ElementRef;

  constructor(private websocket: WebsocketService) { }

  ngAfterViewChecked() {
    if (this.toScroll) {
      try {
        this.convTainer.nativeElement.scrollTop = this.convTainer.nativeElement.scrollHeight;
      } catch(err) { }
      this.toScroll = false;
    }
  }

  ngDoCheck() {
    let newTotalMsgs = 0;
    if (this.messages) { newTotalMsgs = this.messages.length; }
    if (this.totalMsgs !== newTotalMsgs) {
      this.toScroll = true;
      this.totalMsgs = newTotalMsgs;
    }
  }

  private sendMessage(): void {
    if (Utils.isEmpty(this.userInput)) {
      return;
    }

    this.websocket.send('message', {
      recipient: this.recipient,
      type: 'text',
      payload: this.userInput
    });
    this.userInput = '';
  }

  private handleTypingState() {
    if (!Utils.isEmpty(this.userInput) && !this.wasTyping) {
      this.websocket.send('typing-on');
      this.wasTyping = true;
    } else if (Utils.isEmpty(this.userInput) && this.wasTyping) {
      this.websocket.send('typing-off');
      this.wasTyping = false;
    }
  }

  private handleKeyDown(event): void {
    this.userInput = event.target.value;

    if (event.keyCode === 13) {
      this.sendMessage();
    }

    this.handleTypingState();
  }
}
