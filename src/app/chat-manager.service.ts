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


  getResponse(character: String, userMessage: String): String {
    let userWords = userMessage.split(' ')
    let intent = this.getIntent(userWords)
    let response = this.formulateResponse(intent, character)
    return response
  }

  private getIntent(userMessage){
    return {
      subject: this.getSubject(userMessage),
      type: this.getQuestionType(userMessage)
    }
  }

  private getSubject(userMessage){
    return undefined
  }
  
  private getQuestionType(userMessage){
    return undefined
  }

  private formulateResponse(intent, character){
    if (!intent.subject){
      return 'I\'m not even sure what you\'re asking about'
    }

    if (!this.knowsAbout(character, intent.subject)){
      return 'I don\'t know anything about ' + intent.subject
    }


  }

  private knowsAbout(character, subject){
    return false
  }

}
