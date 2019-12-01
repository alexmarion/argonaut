// TODO: I will probably kill this, just a late night idea
/**
 * @description The Grid is a specialized (potenitally nested) object built to act like an array.
 * The key feature of this class is that it lazy loads which allows for faster stringification.
 * e.g. [[null, 2], [null, null]] vs. {1: {2: 2}}
 * This class can convert back and forth between its own representation and nested arrays.
 * @class Grid
 */
class Grid {
  constructor(...dimensions) {
    if(dimensions == null || dimensions.length === 0) {
      throw new Error('At least one dimension must be defined.'));
    }
    this.dimension = {};
    this.dimensions = dimension;
  }
}

module.exports = grid;
