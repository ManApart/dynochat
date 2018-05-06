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
    console.log(characterName, 'responding to ', userMessage)
    let character = this.characters.find(char => { return char.name == characterName })
    let userWords = userMessage.toLocaleLowerCase().replace(/[^a-zA-Z ]/g, '').split(' ')
    let address = this.createPropertyAddress(userWords)
    //find trigger words
    let response = this.formulateResponse(address, character)
    return response
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

  private formulateResponse(address, character) {
    console.log('responding about', address)
    if (!address) {
      return 'I\'m not even sure what you\'re asking about'
    }

    let responseInfo = this.createResponseInfo(character, address)

    if (!responseInfo) {
      return 'I don\'t know anything about ' + address
    }

    return address + ': ' + this.formatAnswer(character, responseInfo)

  }

  private createResponseInfo(character, address) {
    console.log('asking', character.name, 'about', address)
    let characterKnown = character.knows.find(knownString => {
      //the character knows a part of this path
      return knownString.indexOf(address) || address.indexOf(knownString)
    })
    let characterKnows = (characterKnown.length < address.length)
    let addressArray = address.split('.')
    let topicName = addressArray.shift()
    let topic = this.characters.find(char => { return char.name == topicName })
    let value: any = topic

    while (addressArray.length > 0) {
      value = value[addressArray.shift()]
    }

    // console.log('known', address, topicName, addressArray, value)

    return {
      address: address,
      characterKnows: characterKnows,
      value: value
    }
  }

  private formatAnswer(character, responseInfo) {
    console.log('formatting answer', responseInfo)

    let dialogue = this.dialogue.find(prop => {
      let i = responseInfo.address.indexOf(prop.property)
      return i > -1 && responseInfo.address.substring(i) === prop.property
    })
    console.log('info', dialogue)

    let val = (responseInfo.value instanceof Object) ? responseInfo[Object.keys(responseInfo)[0]] : responseInfo.value

    if (dialogue) {
      let response = this.getAppropriateResponse(responseInfo, dialogue)
      return this.fillResponseVariables(response, character, val, responseInfo.address)
    }

    return (responseInfo.characterKnows ? 'Yeah, I know about ' : 'I don\'t know about ') + val
  }

  getAppropriateResponse(known, dialogue) {
    let response = undefined
    if (!known.characterKnows) {
      response = dialogue.response.unknown
    } else {
      response = dialogue.response.where
    }

    return response || 'I\'m not sure'
  }

  fillResponseVariables(response, character, val, address) {
    return response
      .replace('$character', character.name)
      .replace('$value', val)
      .replace('$subject', address.split('.').shift())
  }

}
