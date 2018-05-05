import { Injectable } from '@angular/core';
import * as characters from 'assets/data/characters.json';
import * as topics from 'assets/data/topics.json';
import * as synonyms from 'assets/data/synonyms.json';

@Injectable()
export class ChatManagerService {
  characters
  topics
  synonyms

  constructor() {
    this.characters = characters
    this.topics = topics
    this.synonyms = synonyms
  }


  getResponse(characterName: String, userMessage: String): String {
    let character = this.characters.find(char => { return char.name = characterName })
    let userWords = userMessage.toLocaleLowerCase().replace(/[^a-zA-Z ]/g, '').split(' ')
    let intent = this.getIntent(userWords)
    let response = this.formulateResponse(intent, character)
    return response
  }

  private getIntent(words) {

    let found = undefined
    words.forEach(word => {
      found = this.characters.find(char => { return char.name.toLowerCase().indexOf(word) > -1 })
    })

    console.log('looked for:', words.join(', '), '. Found', found)

    if (found) {
      return this.findAddress(found, words)
    }
    return undefined
    // subjectProperties: ['Breymin', 'residence', 'town'],
    // subjectAddress: 'Breymin.residence.town'
  }

  private findAddress(topic, words) {
    // let wordsToTry = words.slice()
    let address = []
    address.push(topic.name)

    let foundWords = []

    console.log(Object.keys(topic))
    words.forEach(word => {
      
      if (Object.keys(topic).indexOf(word)){
        console.log('found property for word', word)
      }
    });


    console.log(address)
    return address.join('.')
  }

  private formulateResponse(address, character) {

    if (!address) {
      return 'I\'m not even sure what you\'re asking about'
    }

    let known = this.known(character, address)

    if (!known) {
      return 'I don\'t know anything about ' + address
    }

    return 'You asked about ' + address + '. ' + this.formatAnswer(character, known)

  }

  private known(character, subject) {
    let characterKnown = character.knows.find(address => {
      //the character knows a part of this path
      return address.indexOf(subject.address) || subject.address.indexOf(address)
    })
    let address = characterKnown.length < subject.length ? characterKnown : subject
    let topicName = address.split('.')[0]
    let topic = this.characters.find(char => { return char.name = topicName })
    let restOfAddress = address.substring(address.indexOf('.'))
    let value = address.split('.') > 0 ? topic[restOfAddress] : topic

    return value
  }

  private formatAnswer(character, known) {
    if (known instanceof String) {
      return 'Yeah, I know about ' + known
    }

    return 'Yeah, I know about ' + known[Object.keys(known)[0]]


  }

}
