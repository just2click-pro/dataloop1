#!/usr/bin/env node
"use strict"

const yargs = require("yargs")

const validUrl = require("valid-url")

const { info, success, error } = require("./messaging")
const { crawlIn } = require("./crawler")

let depth = 0
const images = { results: [] }

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
  images.results.push([...linksAtDepth.images])

  depth++

  while (depth <= options.depth) {
    if (linksAtDepth?.links) {
      linksAtDepth.links?.forEach(async (link, index) => {
        const moreLinks = await crawlIn(link.href, depth)
        if (moreLinks?.images) {
          images.results.push([...moreLinks.images])
        }
      })
      depth++
    }
    // console.log("*** images: final", JSON.parse(JSON.stringify(images.results)))
  }

  // const handleProcessing = async () => {
  //   for (let i = 1; i <= options.depth; i++) {
  //     let moreLinks = []
  //     linksAtDepth.links?.forEach(async (link) => {
  //       if (link?.href) {
  //         moreLinks = await crawlIn(link.href, i)
  //         images.push([...moreLinks.images])

  //         resetFile("results")
  //         saveFile(images, "results")
  //       }
  //     })
  //   }
  // }

  // console.log("*** processi ", await handleProcessing())
}

process()
