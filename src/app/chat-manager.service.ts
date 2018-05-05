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


  getResponse(characterName: String, userMessage: String): String {
    let character = this.characters.find(char => {return char.name = characterName})
    let userWords = userMessage.split(' ')
    let intent = this.getIntent(userWords)
    let response = this.formulateResponse(intent, character)
    return response
  }

  private getIntent(userMessage) {
    return {
      properties: ['Breymin'],
      address: 'Breymin'
      // subjectProperties: ['Breymin', 'residence', 'town'],
      // subjectAddress: 'Breymin.residence.town'
    }
  }

  private formulateResponse(intent, character) {

    if (!intent.address) {
      return 'I\'m not even sure what you\'re asking about'
    }

    let known = this.known(character, intent.address)

    if (!known) {
      return 'I don\'t know anything about ' + intent.address
    }

    return 'You asked about ' + intent.address + '. ' + this.formatAnswer(character, known)

  }

  private known(character, subject) {
    let characterKnown = character.knows.find(address => {
      //the character knows a part of this path
      return address.indexOf(subject.address) || subject.address.indexOf(address)
    })
    let address = characterKnown.length < subject.length ? characterKnown : subject
    let topicName = address.split('.')[0]
    let topic = this.characters.find(char => {return char.name = topicName})
    let restOfAddress = address.substring(address.indexOf('.'))
    let value = address.split('.') > 0 ? topic['restOfAddress'] : topic
    console.log ('rest', restOfAddress)
    
    return value
  }

  private formatAnswer(character, known){
    if (known instanceof String){
      return 'Yeah, I know about ' + known
    }

    return 'Yeah, I know about ' + known[Object.keys(known)[0]]


  }

}
