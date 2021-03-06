import BuildingBlock from '../building-block.js'
import { exec } from '../util/child-process-promise.js'
import * as unicodes from '../util/unicodes.js'
import { padText } from '../util/pad-text.js'

const padRemaining = padText({ padStart: true })

const rePercentage = /\d+%/
const reActive = /Discharging|Charging/
const reRemaining = /\d\d:\d\d:\d\d/

class Battery extends BuildingBlock {
  static block = 'Battery'

  update = async () => {
    const { stdout } = await exec('acpi -b')
    const batteries = stdout
      .trim()
      .split('\n')
      .map((info, i) => {
        const [percent] = info.match(rePercentage).map(parseInt)
        const active = Boolean(info.match(reActive))
        const remaining = info.match(reRemaining) || ['']
        // const remaining =
        // active && info.replace(/.+\d+%, /, '').replace(/ .*/, '')
        const status = info.includes('Charging') ? 'CHR' : 'BAT'
        return { percent, active, remaining: remaining[0], status }
      })
    return batteries
  }
  render = batteries =>
    batteries.map(({ percent, active, remaining, status }, i) => ({
      name: `bat-${i}`,
      full_text: `${this.icon(
        active ? unicodes.lightningBolt.padEnd(2) : ''
      )}${status} ${percent}%${padRemaining(remaining)}`,
      color:
        percent < this.config.sick_threshold && status !== 'CHR'
          ? this.colors.sick
          : this.colors.normal
    }))
}

export { Battery }
