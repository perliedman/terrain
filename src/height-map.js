module.exports = class HeightMap {
  constructor (graph) {
    this.graph = graph
    this.heights = graph.polygons.map(() => 0)
  }
}
