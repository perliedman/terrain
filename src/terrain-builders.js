module.exports = {
  island (heightMap, x, y, height, radius, sharpness) {
    return modNeighbors(heightMap, x, y, height, radius, sharpness, (h, j) => heightMap.heights[j] * radius)
  },
  mountain (heightMap, x, y, height, radius, sharpness) {
    return modNeighbors(heightMap, x, y, height, radius, sharpness, (h, j) => h * radius)
  },
  relax (heightMap) {
    return heightMap.mapHeights((poly, h) =>
      poly.neighbors.reduce(
        (sumHeight, neighborIndex) => sumHeight + heightMap.heights[neighborIndex], h) /
      (poly.neighbors.length + 1))
  },
  normalize (heightMap) {
    const minMax = heightMap.heights.reduce((minMax, h) => [
      Math.min(minMax[0], h),
      Math.max(minMax[1], h)
    ], [Number.MAX_VALUE, Number.MIN_VALUE])
    const dh = minMax[1] - minMax[0]

    return heightMap.mapHeights((_, h) => (h - minMax[0]) / dh)
  },
  peaky (heightMap) {
    this.normalize(heightMap)
    return heightMap.mapHeights((_, h) => Math.sqrt(h))
  }
}

function modNeighbors(heightMap, x, y, height, radius, sharpness, falloffFn) {
  const diagram = heightMap.graph.diagram
  const heights = heightMap.heights
  const polygons = heightMap.graph.polygons
  const start = diagram.find(x, y).index
  const queue = []
  const used = {}

  heights[start] += height
  used[start] = true
  queue.push(start)

  for (var i = 0; i < queue.length && height > 0.001; i++) {
    const j = queue[i]

    height = falloffFn(height, j)

    polygons[j].neighbors.forEach(e => {
      if (!used[e]) {
        const mod = 1 + Math.random() * sharpness * 2 - sharpness

        heights[e] = Math.min(1, heights[e] + height * mod)
        used[e] = true
        queue.push(e)
      }
    })
  }
}