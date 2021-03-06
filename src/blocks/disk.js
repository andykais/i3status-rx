import BuildingBlock from '../building-block.js'
import { exec } from '../util/child-process-promise.js'
import { humanSizes } from '../util/human-readable.js'
import { parseTable } from '../util/parse-table.js'

const parseDiskTable = parseTable(
  [null, 'size', 'used', 'available', 'usePercent'],
  parseInt
)

const reInfo = /\/dev\/sda2\s+\d+\s+\d+\s+(\d+)\s+(\d+)/
class Disk extends BuildingBlock {
  static block = 'Disk'

  update = async () => {
    const { stdout } = await exec(`df ${this.config.disk} | tail -1`)
    const [{ available, usePercent }] = parseDiskTable(stdout)
    return {
      available,
      usePercent
    }
  }
  render = ({ available, usePercent }) => [
    {
      name: `disk-${this.config.disk}`,
      full_text: `DISK: ${humanSizes(available * 1024, { sigfig: 1 })}`,
      color:
        100 - usePercent < this.config.sick_threshold
          ? this.colors.sick
          : this.colors.normal
    }
  ]
}

export { Disk }
