const poissonDiscSampler = require('poisson-disc-sampler')
const {voronoi} = require('d3-voronoi')

const defaultOptions = {
  width: 1,
  height: 1,
  pointSampler: null
}

module.exports = class Graph {
  constructor (numberPoints, options) {
    options = {...defaultOptions, ...options}

    this.sites = this._createPoints(numberPoints, options)

    const v = voronoi()
      .size([options.width, options.height])

    this.diagram = v(this.sites)
    this.polygons = this.diagram.polygons()
    this.triangles = this.diagram.triangles()

    this._findNeighbors()
  }

  map (fn) {
    return this.polygons.map(fn)
  }

  _createPoints (numberPoints, options) {
    if (Array.isArray(numberPoints)) {
      return numberPoints.slice()
    } else {
      numberPoints = numberPoints || 4096
      const points = new Array(numberPoints)

      if (!options.pointSampler) {
        const a = options.width * options.height / numberPoints
        const r = Math.sqrt(a / Math.PI) * 1.4 // 1.4 is a fudge factor
        const sampler = poissonDiscSampler(options.width, options.height, r)
        options.pointSampler = () => sampler()
      }

      for (var i = 0; i < numberPoints; i++) {
        points[i] = options.pointSampler()
      }

      return points.filter(p => p)
    }
  }

  _findNeighbors () {
    this.polygons.forEach((poly, i) => {
      poly.index = i; // index of this element
      poly.height = 0;
      const neighbors = [];
      this.diagram.cells[i].halfedges.forEach(e => {
        const edge = this.diagram.edges[e]
        if (edge.left && edge.right) {
          var ea = edge.left.index;
          if (ea === i) {
            ea = edge.right.index;
          }
          neighbors.push(ea);
        }
      })
      poly.neighbors = neighbors;
    });
  }
}
