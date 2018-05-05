import { Injectable, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import * as charactersJson from 'assets/data/characters.json';

@Injectable()
export class DataService implements OnInit{
  private chars
  public readonly characters

  private selectedChar
  public readonly selectedCharacter

  constructor() { 
    this.chars = new BehaviorSubject<any>(charactersJson)
    this.characters = this.chars.asObservable()
    this.selectedChar = new BehaviorSubject<any>(this.chars.getValue()[0])
    this.selectedCharacter = this.selectedChar.asObservable()
    
    // console.log(chars)
  }

  ngOnInit(): void {
    
  }

  selectCharacter(character){
    let char = this.chars.find(char => {return char.name = character})
    this.selectedChar.next(char)
  }

}
