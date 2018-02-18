module.exports = class HeightMap {
  constructor (graph) {
    this.graph = graph
    this.heights = graph.polygons.map(() => 0)
  }

  mapHeights (fn) {
    this.heights = this.graph.map(fn)
    return this
  }
}
