/**
 * Copyright (c) 2014-present, Facebook, Inc. All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */
const helpers = require('./helpers')

const { cursor, color, window } = helpers

const write = string => process.stdout.write(string)

class NyanReporter {
  /**
   * Constructor for the NyanReporter.
   * Options aren't directly passed to the NyanReporter
   * but are instead passed through Jest. We specify the options in the
   * jest configuration and as a result they are passed to us
   *
   * Following options are supported with Jest right now:
   *
   * - suppressErrorReporter
   *   If this is `true` the Error reporter isn't showed in case tests fail.
   *
   * - renderOnRunCompletely
   *   If true, the output is only rendered when the run completes successfully
   *
   * @constructor
   */
  constructor(options = {}) {
    const nyanCatWidth = (this.nyanCatWidth = 11)
    const width = window.width * 0.75 || 0

    this.colorIndex = 0
    this.numberOfLines = 4
    this.rainbowColors = this.generateColors()
    this.scoreboardWidth = 5
    this.tick = 0
    this.trajectories = [[], [], [], []]
    this.trajectoryWidthMax = width - nyanCatWidth

    this.suppressErrorReporter = options.suppressErrorReporter || false
    this.renderOnRunCompletely = options.renderOnRunCompletely || false
  }

  onRunStart(config, results) {
    cursor.CR()
    cursor.hide()

    if (!this.renderOnRunCompletely) {
      this.draw(results)
    }
  }

  onTestResult(config, result, results) {
    if (!this.renderOnRunCompletely) {
      this.draw(results)
    }
  }

  onRunComplete(config, results) {
    this.draw(results)
    cursor.show()
    for (let i = 0; i < this.numberOfLines; i++) {
      write('\n')
    }

    helpers.epilogue(results)

    if (!this.suppressErrorReporter) {
      helpers.printFailureMessages(results)
    }
  }

  /**
   * Generate rainbow colors
   *
   * @private
   * @return {Array}
   */
  generateColors() {
    const colors = new Array(6)
    for (let i = 0; i < 6 * 7; i++) {
      const pi3 = Math.floor(Math.PI / 3)
      const n = i * (1.0 / 6)
      const r = Math.floor(3 * Math.sin(n) + 3)
      const g = Math.floor(3 * Math.sin(n + 2 * pi3) + 3)
      const b = Math.floor(3 * Math.sin(n + 4 * pi3) + 3)
      colors[i] = 36 * r + 6 * g + b + 16
    }
    return colors
  }

  drawScoreboard({
    numPassedTests,
    numFailedTests,
    numPendingTests,
    numTotalTests,
  }) {
    this.drawType('total tests', numTotalTests || 0)
    this.drawType('green', numPassedTests || 0)
    this.drawType('fail', numFailedTests || 0)
    this.drawType('pending', numPendingTests || 0)

    this.cursorUp(this.numberOfLines)
  }

  /**
   * Draws the type of stat along with a color
   */
  drawType(type, n) {
    write(' ')
    write(color(type, n))
    write('\n')
  }

  /**
   * Append the rainbow.
   * @private
   *
   * @param {string} str
   * @return {string}
   */
  appendRainbow() {
    const segment = this.tick ? '_' : '-'
    const rainbowified = this.rainbowify(segment)

    for (let index = 0; index < this.numberOfLines; index++) {
      const trajectory = this.trajectories[index]
      if (trajectory.length >= this.trajectoryWidthMax) {
        trajectory.shift()
      }
      trajectory.push(rainbowified)
    }
  }

  /**
   * Main draw function to draw the output of the reporter
   */
  draw(results = {}) {
    this.appendRainbow()
    this.drawScoreboard(results)
    this.drawRainbow()
    this.drawNyanCat(results)

    this.tick = !this.tick
  }

  /**
   * Draw the Nyan Cat
   *
   * @private
   */
  drawNyanCat(results) {
    const self = this
    const startWidth = this.scoreboardWidth + this.trajectories[0].length
    const dist = `\u001b[${startWidth}C`
    let padding = ''

    write(dist)
    write('_,------,')
    write('\n')

    write(dist)
    padding = self.tick ? '  ' : '   '
    write(`_|${padding}/\\_/\\ `)
    write('\n')

    write(dist)
    padding = self.tick ? '_' : '__'
    const tail = self.tick ? '~' : '^'
    write(`${tail}|${padding}${this.face(results)} `)
    write('\n')

    write(dist)
    padding = self.tick ? ' ' : '  '
    write(`${padding}""  "" `)
    write('\n')

    this.cursorUp(this.numberOfLines)
  }

  face(results) {
    if (results.numFailedTests) {
      return '( x .x)'
    }
    if (results.numPendingTests) {
      return '( o .o)'
    }
    if (results.numPassedTests) {
      return '( ^ .^)'
    }
    return '( - .-)'
  }

  /**
   * Draw the rainbow
   */
  drawRainbow() {
    this.trajectories.forEach(line => {
      write(`\u001b[${this.scoreboardWidth}C`)
      write(line.join(''))
      write('\n')
    })

    this.cursorUp(this.numberOfLines)
  }

  rainbowify(str) {
    if (!helpers.useColors) {
      return str
    }

    const color = this.rainbowColors[
      this.colorIndex % this.rainbowColors.length
    ]
    this.colorIndex += 1
    return `\u001b[38;5;${color}m${str}\u001b[0m`
  }

  /**
   * Move cursor up `n`
   *
   * @private
   * @param {number} n
   */
  cursorUp(n) {
    write(`\u001b[${n}A`)
  }

  /**
   * Move cursor down `n`
   */
  cursorDown(n) {
    write(`\u001b[${n}B`)
  }
}

module.exports = NyanReporter
