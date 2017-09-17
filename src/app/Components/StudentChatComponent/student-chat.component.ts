import { Component } from '@angular/core';

import { WebsocketService } from '../../Services/websocket.service';

@Component({
  selector: 'student-chat',
  templateUrl: './student-chat.component.html',
  styleUrls: [ './student-chat.component.scss' ],
  providers: [ WebsocketService ]
})
export class StudentChatComponent {

  private emitterType = 'student';

  constructor(private websocket: WebsocketService) {
    this.websocket.send('init', {emitterType: this.emitterType});
  }
}
