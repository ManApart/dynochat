import { Injectable } from '@angular/core';
import * as charactersJson from 'assets/data/characters.json';
import * as topicsJson from 'assets/data/topics.json';
import * as dialogueJson from 'assets/data/dialogue.json';

@Injectable()
export class ChatManagerService {
  characters
  topics
  dialogue

  constructor() {
    this.characters = charactersJson
    this.topics = topicsJson
    this.dialogue = dialogueJson
  }

  getResponse(characterName: String, userMessage: String): String {
    let character = this.characters.find(char => { return char.name == characterName })
    let userWords = userMessage.toLocaleLowerCase().replace(/[^a-zA-Z ]/g, '').split(' ')
    let address = this.createPropertyAddress(userWords)
    // console.log('asking', character.name, 'about', address)
    
    let responseInfo = {
      address: address,
      characterKnows: this.doesCharacterKnow(address, character),
      value: this.getValue(address)
    }

    return address + ': ' + this.formatAnswer(character, responseInfo)
  }

  private createPropertyAddress(words) {

    let found = undefined
    words.forEach(word => {
      if (!found) {
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

  private findProperty(property, words, address) {
    words.forEach(word => {
      if (Object.keys(property).indexOf(word) > -1) {
        address.push(word)
        let child = property[word]
        this.findProperty(child, words, address)
      }
    })
  }

  private doesCharacterKnow(address, character){
    let characterKnown = character.knows.find(knownString => {
      //the character knows a part of this path
      return knownString.indexOf(address) || address.indexOf(knownString)
    })
    return (characterKnown.length < address.length)
  }

  private getValue(address) {
    let addressArray = address.split('.')
    let topicName = addressArray.shift()
    let topic = this.characters.find(char => { return char.name == topicName })
    let value: any = topic

    while (addressArray.length > 0) {
      value = value[addressArray.shift()]
    }
    return value
  }

  private formatAnswer(character, responseInfo) {
    let dialogue = this.dialogue.find(prop => {
      let i = responseInfo.address.indexOf(prop.property)
      return i > -1 && responseInfo.address.substring(i) === prop.property
    })
    console.log('formatting answer', responseInfo, dialogue)

    let val = (responseInfo.value instanceof Object) ? responseInfo[Object.keys(responseInfo)[0]] : responseInfo.value

    if (dialogue) {
      let response = this.getAppropriateResponse(responseInfo, dialogue)
      return this.fillResponseVariables(response, character, val, responseInfo.address)
    }

    return (responseInfo.characterKnows ? 'Yeah, I know about ' : 'I don\'t know about ') + val
  }

  getAppropriateResponse(responseInfo, dialogue) {
    return  responseInfo.characterKnows ? dialogue.response.default : dialogue.response.unknown
  }

  fillResponseVariables(response, character, val, address) {
    return response
      .replace('$character', character.name)
      .replace('$value', val)
      .replace('$subject', address.split('.').shift())
  }

}
