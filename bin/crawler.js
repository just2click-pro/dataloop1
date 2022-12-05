const cheerio = require("cheerio")
const validUrl = require("valid-url")

const got = (...args) => import("got").then(({ default: got }) => got(...args))

const getAnchorData = (element, depth) => {
  const link = {}

  if (element && element.attr("href")) {
    link.href = element.attr("href") // get the href attribute
  }

  return { ...link, depth: depth }
}

const getImageData = (url, element, depth) => {
  const image = {}

  // Test image element for src and alt attributes
  if (element && element.attr("src")) {
    image.src = element.attr("src") // get the image source
    image.url = url
  }

  return { ...image, depth: depth }
}

const extractLinks = async (url, tag, depth) => {
  try {
    const links = []
    if (validUrl.isUri(url)) {
      // Fetching HTML
      const response = await got(url)

      const html = response.body

      // Using cheerio to extract <a> tags
      const $ = cheerio.load(html)

      // Collect the "href" and "title" of each link and add them to an array
      let linkObjects = $(tag) // get all hyperlinks

      linkObjects.each((index, element) => {
        if (tag === "a") {
          links.push(getAnchorData($(element), depth))
        }
        if (tag === "img") {
          links.push(getImageData(url, $(element), depth))
        }
      })
    }

    return links
  } catch (e) {}
}

const crawlIn = async (url, depth) => {
  const urlLinks = await extractLinks(url, "a", depth)
  const urlImages = await extractLinks(url, "img", depth)

  return { links: urlLinks, images: urlImages }
}

module.exports = {
  crawlIn,
}
