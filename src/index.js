
const size = {
    mapWidth: 9,
    mapHeight: 9,
    tileSize: 50,
};

const g = new Graph();
g.setGraph(g.generateNodeMap(size));
new Render(g).startRendering();