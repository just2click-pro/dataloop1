const chalk = require("chalk")
const boxen = require("boxen")

const boxenOptionsInfo = {
  padding: 1,
  margin: 0,
  borderStyle: "round",
  borderColor: "#0099cc",
  backgroundColor: "#33b5e5",
  color: "#000",
}

const boxenOptionsSuccess = {
  padding: 1,
  margin: 0,
  borderStyle: "round",
  borderColor: "#007e33",
  backgroundColor: "#00c851",
  color: "#000",
}

const boxenOptionsDanger = {
  padding: 1,
  margin: 0,
  borderStyle: "round",
  borderColor: "#cc0000",
  backgroundColor: "#ff4444",
  color: "#000",
}

const displayInfoMessage = (message) => {
  console.log(boxen(message, boxenOptionsInfo))
}

const displaySuccessMessage = (message) => {
  console.log(boxen(message, boxenOptionsSuccess))
}

const displayErrorMessage = (message) => {
  console.log(boxen(message, boxenOptionsDanger))
}

module.exports = {
  info: displayInfoMessage,
  success: displaySuccessMessage,
  error: displayErrorMessage,
}
