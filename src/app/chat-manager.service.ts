import { Injectable } from '@angular/core';

@Injectable()
export class ChatManagerService {
  characters
  topics
  synonyms

  constructor() {
    this.characters = require('assets/data/characters.json')
    this.topics = require('assets/data/topics.json')
    this.synonyms = require('assets/data/synonyms.json')
  }

}
