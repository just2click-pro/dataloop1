"use strict"

const fs = require("fs")
const { info, success, error } = require("./messaging")

const saveJSON = (obj, filename) => {
  // Handle the case of an empty filename
  filename = filename && filename.length > 0 ? filename : "results"

  try {
    fs.writeFileSync(`${filename}.json`, JSON.stringify(obj))
    success(`Sucessfuly saved, ${filename}...`)
  } catch (e) {
    error(`Failed to save, ${filename}, due to ${e.message}`)
  }
}

const deleteFileIfExists = (filename) => {
  const filePath = `./${filename}.json`
  fs.existsSync(filePath, (exists) => {
    if (exists) {
      info(`File ${filePath} already exists, deleting ...`)
      fs.unlinkSync(filePath)
    }
  })
}

module.exports = {
  saveFile: saveJSON,
  resetFile: deleteFileIfExists,
}
