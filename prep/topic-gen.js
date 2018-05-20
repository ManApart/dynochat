const base = require('./topics-base.json')
const fs = require('fs')

let topics = base

addInheritedProperties(topics)

topics = topics.filter(topic => { return !topic.abstract })

fs.writeFileSync('../src/assets/data/topics.json', JSON.stringify(topics))


function addInheritedProperties(topics) {
    topics.forEach(topic => {
        addBaseValues(topic, topics)
    })
}

function addBaseValues(topic, topics) {
    if (topic.inherits) {
        topic.inherits.forEach(inheritId => {
            let parent = topics.find(topic => { return topic.name === inheritId })
            addBaseValues(parent, topics)
            appendProperties(topic, parent)
        })
        topic.inherits = undefined
    }
}

function appendProperties(topic, parent) {
    console.log('adding values from', parent.name, 'to', topic.name)
    let parentKeys = getDeepKeys(parent)
    parentKeys.forEach(key => {
        if (key !== 'abstract') {
            if (!topic[key]) {
                console.log('setting', key, 'to', getValue(key, parent))
                setValue(key, topic, getValue(key, parent))
            } else if (Array.isArray(topic[key])) {
                console.log('appending', parent[key], 'to', key)
                topic[key] = topic[key].concat(parent[key])
            }
        }
    })

}

function getDeepKeys(obj) {
    let keys = []
    for (let key in obj) {
        keys.push(key);
        if (typeof obj[key] === "object" && !Array.isArray(obj[key])) {
            let subkeys = getDeepKeys(obj[key])
            keys = keys.concat(subkeys.map(function (subkey) {
                return key + "." + subkey
            }))
        }
    }
    return keys
}

function getValue(address, object) {
    let addressArray = address.split('.')
    let value = object

    while (addressArray.length > 0) {
        value = value[addressArray.shift()]
    }
    return value
}

function setValue(address, object, value) {
    let addressArray = address.split('.')
    let propertyParent = object

    while (addressArray.length > 1) {
        propertyParent = propertyParent[addressArray.shift()]
    }

    propertyParent[addressArray.shift()] = value
}