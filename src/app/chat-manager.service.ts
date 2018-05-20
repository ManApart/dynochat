import { Injectable } from '@angular/core';
import * as topicsJson from 'assets/data/topics.json';
import * as dialogueJson from 'assets/data/dialogue.json';

@Injectable()
export class ChatManagerService {
  topics
  dialogue

  constructor() {
    this.topics = topicsJson
    this.dialogue = dialogueJson
  }

  getResponse(characterName: String, userMessage: String): String {
    let character = this.topics.find(char => { return char.type && char.type.indexOf('character') != -1 && char.name == characterName })
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
        found = this.topics.find(char => { return char.name.toLowerCase().indexOf(word) > -1 })
      }
    })

    if (found) {
      return this.findAddress(found, words)
    }
    return undefined
  }

  private findAddress(topic, words) {
    console.log('finding address for', topic, words)
    
    //get all property strings
    let allKeys = this.getDeepKeys(topic)

    //find the one with the most word matches
    let sorted = allKeys.map(key =>{
      let score = 0
      words.forEach(word => {
        score += (key.indexOf(word) > -1) ? 1 : 0
      });
      return {
        key: key,
        score: score
      }
    })
    .sort((a, b) => {
      return b.score - a.score
    })

    let highestScore = sorted[0]
    console.log('keys', sorted, highestScore)
    //stop at the lowest level of detail?

    return topic.name + "." + highestScore.key 
  }

  private getDeepKeys(obj) {
    let keys = []
    for(let key in obj) {
        keys.push(key);
        if(typeof obj[key] === "object" && !Array.isArray(obj[key])) {
            let subkeys = this.getDeepKeys(obj[key])
            keys = keys.concat(subkeys.map(function(subkey) {
                return key + "." + subkey
            }))
        }
    }
    return keys
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
    let topic = this.topics.find(char => { return char.name == topicName })
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
    val = val || 'that'

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
