const base = require('./topics-base.json')
const fs = require('fs')
const ignoredProperties = ['abstract', 'parameters']

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
        topic.inherits.forEach(params => {
            let parent = topics.find(topic => { return topic.name === params.name })
            addBaseValues(parent, topics)
            appendProperties(topic, parent, params)
        })
        topic.inherits = undefined
    }
}

function appendProperties(topic, parent, params) {
    console.log('adding values from', parent.name, 'to', topic.name)
    let parentKeys = getDeepKeys(parent)
    parentKeys.forEach(key => {
        if (ignoredProperties.indexOf(key) == -1) {
            if (!topic[key]) {
                let value = replaceParams(getValue(key, parent), params)
                console.log('setting', key, 'to', value)
                setValue(key, topic, value)
            } else if (Array.isArray(topic[key])) {
                let modified = replaceParamsList(parent[key], params)
                console.log('appending', modified, 'to', key)
                topic[key] = topic[key].concat(modified)
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

function replaceParamsList(valueList, params) {
    return valueList.map(value => { return replaceParams(value, params) })
}

function replaceParams(value, params) {
    let modified = value
    if (value.indexOf('$') > -1) {
        for (let key in params) {
            modified = modified.replace('$' + key, params[key])
        }
        console.log('modified', value, 'to', modified)
    }
    return modified
}

function setValue(address, object, value) {
    let addressArray = address.split('.')
    let propertyParent = object

    while (addressArray.length > 1) {
        propertyParent = propertyParent[addressArray.shift()]
    }

    propertyParent[addressArray.shift()] = value
}