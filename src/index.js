
const size = {
    mapWidth: 9,
    mapHeight: 9,
    tileSize: 50,
};

const g = new Graph();
const d = new Dijkstra();
g.setGraph(g.generateNodeMap(size));
g.setAlgorithm(d);
new Render(g).startRendering();