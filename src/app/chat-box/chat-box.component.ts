import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { ISubscription } from 'rxjs/Subscription';
import { ChatManagerService } from '../chat-manager.service';

@Component({
  selector: 'app-chat-box',
  templateUrl: './chat-box.component.html',
  styleUrls: ['./chat-box.component.css']
})
export class ChatBoxComponent implements OnInit {
  characterSubscription: ISubscription
  selectedCharacter
  userMessage
  response

  constructor(private dataService: DataService, private chatManager: ChatManagerService) {
    this.characterSubscription = this.dataService.selectedCharacter.subscribe(character => {
      this.selectedCharacter = character.name
    })
  }

  ngOnInit() {
    this.onEnter('breymin town residence')
    // this.onEnter('eln building residence')
    // this.onEnter('Do you know Breymin town residence?')
  }

  onEnter(value) {
    console.log(value)
    this.response = this.chatManager.getResponse(this.selectedCharacter, value)
  }

}
