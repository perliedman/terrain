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
    const diagram = v(this.sites)

    this.polygons = diagram.polygons()
    this.triangles = diagram.triangles()
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
}
