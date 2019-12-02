/* eslint no-underscore-dangle: ["error", { "allow": ["_iterateRecurse"] }] */

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
   * @description Retreives all data as pure objects (unwraps grid).
   * @returns {Object}
   * @memberof Grid
   */
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

  /**
   * @description Iterates over each element in the grid.
   * @param {Function} fxn - A function with the signature (data, ...coordinates)
   * @memberof Grid
   */
  iterate(fxn) {
    this._iterateRecurse(fxn);
  }

  _iterateRecurse(fxn, ...coordinates) {
    const isLast = this.dimensions.length === 1;
    Object.keys(this.dimension).forEach((coordinate) => {
      if(isLast) {
        fxn(this.dimension[coordinate], ...coordinates, coordinate);
      } else {
        this._iterateRecurse(fxn, ...coordinates, coordinate);
      }
    });
  }
}

const dummyAgentObj = { type: 'agent', x: 'xxx', y: 'yyy' };
const WORLD_WIDTH = 800;
const WOLRD_HEIGHT = 600;

// Empty grids
const grid1 = JSON.stringify(Array(WORLD_WIDTH).fill(null)
  .map(() => Array(WOLRD_HEIGHT).fill(null)));
const grid2 = new Grid(WORLD_WIDTH, WOLRD_HEIGHT);

// Filled grids
const grid3 = JSON.stringify(Array(WORLD_WIDTH).fill(null)
  .map(() => Array(WOLRD_HEIGHT).fill(dummyAgentObj)));
const grid4 = new Grid(WORLD_WIDTH, WOLRD_HEIGHT);
for(let x = 0; x < WORLD_WIDTH; x++) {
  for(let y = 0; y < WOLRD_HEIGHT; y++) {
    grid4.set(dummyAgentObj, x, y);
  }
}
console.log('grid1', grid1.length); // 4.803202 megabytes
console.log('grid2', JSON.stringify(grid2.getAll()).length); // 2 bytes
console.log('grid3', grid3.length); // 35.523202 megabytes
console.log('grid4', JSON.stringify(grid4.getAll()).length); // 41.116582 megabytes

module.exports = Grid;
