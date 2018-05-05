import { Injectable } from '@angular/core';
import * as charactersJson from 'assets/data/characters.json';
import * as topicsJson from 'assets/data/topics.json';
import * as synonymsJson from 'assets/data/synonyms.json';

@Injectable()
export class ChatManagerService {
  characters
  topics
  synonyms

  constructor() {
    this.characters = charactersJson
    this.topics = topicsJson
    this.synonyms = synonymsJson
  }


  getResponse(characterName: String, userMessage: String): String {
    console.log(characterName, 'responding to ', userMessage)
    let character = this.characters.find(char => { return char.name == characterName })
    let userWords = userMessage.toLocaleLowerCase().replace(/[^a-zA-Z ]/g, '').split(' ')
    let intent = this.getIntent(userWords)
    let response = this.formulateResponse(intent, character)
    return response
  }

  private getIntent(words) {

    let found = undefined
    console.log('cars', this.characters)
    words.forEach(word => {
      if (!found){
        found = this.characters.find(char => { return char.name.toLowerCase().indexOf(word) > -1 })
      }
    })

    if (found) {
      return this.findAddress(found, words)
    }
    return undefined
  }

  private findAddress(topic, words) {
    console.log('finding address for', topic, words)
    let address = []
    address.push(topic.name)

    this.findProperty(topic, words, address)

    return address.join('.')
  }

  private findProperty(property, words, address){
    words.forEach(word => {
      if (Object.keys(property).indexOf(word) > -1){
        address.push(word)
        let child = property[word]
        this.findProperty(child, words, address)
      }
    })
  }

  private formulateResponse(address, character) {
    console.log('responding about', address)
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
    // console.log('asking', character.name, 'about', subject)
    let characterKnown = character.knows.find(address => {
      //the character knows a part of this path
      return address.indexOf(subject.address) || subject.address.indexOf(address)
    })
    let address = characterKnown.length < subject.length ? characterKnown : subject
    let addressArray = address.split('.')
    let topicName = addressArray.shift()
    let topic = this.characters.find(char => { return char.name == topicName })
    let value: any = topic

    while (addressArray.length > 0 ){
      value = value[addressArray.shift()]
    }

    // console.log('known', address, topicName, addressArray, value)

    return value
  }

  private formatAnswer(character, known) {
    // console.log('formatting answer', known, Object.keys(known))
    if (known instanceof Object) {
      return 'Yes, I know about ' + known[Object.keys(known)[0]]
    }
    return 'Yeah, I know about ' + known



  }

}
