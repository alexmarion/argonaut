// TODO: I will probably kill this, just a late night idea
/**
 * @description The Grid is a specialized (potenitally nested) object built to act like an array.
 * The key feature of this class is that it lazy loads which allows for faster stringification.
 * e.g. [[null, 2], [null, null]] vs. {1: {2: 2}}
 * This class can convert back and forth between its own representation and nested arrays.
 * @class Grid
 * @param {...number} dimensions
 */
class Grid {
  constructor(...dimensions) {
    if(dimensions == null || dimensions.length === 0) {
      throw new Error('At least one dimension must be defined.');
    }
    this.dimension = {};
    this.dimensions = dimensions;
  }

  /**
   * @description Retreives data or grid instance.
   * @param {...number} coordinates
   * @memberof Grid
   */
  get(...coordinates) {
    const coordinate = coordinates[0];
    if(this.dimension[coordinate] == null) {
      return undefined;
    }
    if(this.dimension[coordinate] instanceof Grid) {
      return this.dimension[coordinate].get(...coordinates.slice(1));
    }
    return this.dimension[coordinate];
  }

  /**
   * @description Sets data in the grid.
   * @param {*} data
   * @param {...number} coordinates
   * @memberof Grid
   */
  set(data, ...coordinates) {
    if(coordinates.length !== this.dimensions.length) {
      throw new Error(`${coordinates.length} coordinates passed does not match ${this.dimensions.length} dimensions declared.`);
    }
    const coordinate = coordinates[0];
    const isLast = coordinates.length === 1;
    if(isLast) {
      this.dimension[coordinate] = data;
    } else {
      if(this.dimension[coordinate] == null) {
        this.dimension[coordinate] = new Grid(...this.dimensions.slice(1));
      }
      this.dimension[coordinate].set(data, ...coordinates.slice(1));
    }
  }

  getAll() {
    if(this.dimensions.length === 1) {
      return this.dimension;
    }
    return Object.keys(this.dimension).reduce((collapsedGrid, idx) => {
      // eslint-disable-next-line no-param-reassign
      collapsedGrid[idx] = this.dimension[idx].getAll();
      return collapsedGrid;
    }, {});
  }
}

const xMax = 100;
const yMax = 100;
const test = new Grid(xMax, yMax);
for(let x = 0; x < xMax; x++) {
  for(let y = 0; y < yMax; y++) {
    test.set(`${x}${y}`, x, y);
  }
}
console.log(test.getAll());
// console.log(test.get(99, 50));
module.exports = Grid;
