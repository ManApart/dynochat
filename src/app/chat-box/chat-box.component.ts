import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { ISubscription } from 'rxjs/Subscription';

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

  constructor(private dataService: DataService) {
    this.characterSubscription = this.dataService.selectedCharacter.subscribe(character => {
      this.selectedCharacter = character
    })
  }

  ngOnInit() {
  }

  onEnter(value) {
    console.log(value)
    this.response = value
  }

}
