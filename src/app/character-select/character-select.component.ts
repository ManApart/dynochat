import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { ISubscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-character-select',
  templateUrl: './character-select.component.html',
  styleUrls: ['./character-select.component.css']
})
export class CharacterSelectComponent implements OnInit {
  characterSubscription: ISubscription
  characters = []


  constructor(private dataService: DataService) {
    this.characterSubscription = this.dataService.characters.subscribe(characters =>{
      this.characters = characters.map(character => {return character.name})
    })
  }

  ngOnInit() {
  }

  pickCharacter(character) {
    this.dataService.selectCharacter(character)
  }

}
