#!/usr/bin/env node
"use strict"

const yargs = require("yargs")

const validUrl = require("valid-url")

const { info, success, error } = require("./messaging")
const { crawlIn } = require("./crawler")
const { resetFile, saveFile } = require("./file")

let depth = 0
let images = []

const options = yargs
  .usage("Usage: -u <url> -d <number>")
  .option("u", {
    alias: "url",
    describe: "A URL to crawl",
    type: "string",
    demandOption: true,
  })
  .option("d", {
    alias: "depth",
    describe: "Max depth to crawl",
    type: "string",
    demandOption: true,
  }).argv

info(`Trying to crawl, ${options.url}, maximum depth ${options.depth}!`)

if (validUrl.isUri(options.url)) {
  success(`URL, ${options.url}, is valid, crawling ...`)
} else {
  error(`URL, ${options.url}, is invalid, please try again ...`)
  return
}

const process = async () => {
  let linksAtDepth = await crawlIn(options.url, depth)
  images.push([...linksAtDepth.images])

  depth++

  let paused = false

  const handleProcessing = async () => {
    for (let i = 1; i <= options.depth; i++) {
      let moreLinks = []
      linksAtDepth.links?.forEach(async (link) => {
        if (link?.href) {
          paused = true
          moreLinks = await crawlIn(link.href, i)
          paused = false
          images.push([...moreLinks.images])

          if (images?.length > 0) {
            resetFile("results")
            saveFile(images, "results")
          }
        }
      })
      if (moreLinks?.links?.length > 0 && paused) {
        moreLinks.images = []
        linksAtDepth = { ...moreLinks }
      }
    }
  }

  console.log("*** processing ", await handleProcessing())
}

process()
