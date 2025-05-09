
class Graph {
    constructor() {
        this.nodes = {}; // { name: { x, y } }
        this.edges = {}; // { name: { neighborName: weight } }
        this.weights = {}; // { name: { neighborName: weight } }
        this.size = { mapWidth: 0, mapHeight: 0, tileSize: 0 };
    }

    #getRandomInt = (max) => Math.floor(Math.random() * max);

    #nodeName = (x, y) => `${x},${y}`;
    
    setGraph(data) {
        if (!data) return;

        this.nodes = data.nodes || this.nodes;
        this.edges = data.edges || this.edges;
        this.weights = data.weights || this.weights;
        this.size = data.size || this.size;
        return this;
    }

    generateNodeMap(size) {
        const { mapWidth, mapHeight } = size;
        if (mapWidth <= 0 || mapHeight <= 0) return null;

        const nodes = {};
        const edges = {};
        const weights = {};

        // Create all nodes
        for (let x = 0; x < mapWidth; x++) {
            for (let y = 0; y < mapHeight; y++) {
                const name = this.#nodeName(x, y);
                nodes[name] = { x, y };
                edges[name] = {};
                weights[name] = {};
            }
        }
    
        // Create edges and weights (4-directional: up, down, left, right)
        for (let x = 0; x < mapWidth; x++) {
            for (let y = 0; y < mapHeight; y++) {
                const name = this.#nodeName(x, y);
                const neighbors = [
                    [x - 1, y], // left / venstre
                    [x + 1, y], // right / højre
                    [x, y - 1], // up / op
                    [x, y + 1]  // down / ned
                ];
    
                for (const [nx, ny] of neighbors) {
                    if (nx >= 0 && nx < mapWidth && ny >= 0 && ny < mapHeight) {
                        const neighborName = this.#nodeName(nx, ny);
                        edges[name][neighborName] = 1;
                        weights[name][neighborName] = Math.floor(Math.random() * 10) + 1;
                    }
                }
            }
        }
    
        console.log("Graph Nodes:", nodes);
        console.log("Graph Edges:", edges);
        console.log("Graph Weights:", weights);
        console.log("Graph Size:", size);
        return { nodes, edges, weights, size };
    }
}


class Render {

    getTileColor = (nodeIndex) => {
        const weight = this.graph.weights[nodeIndex];
        const weightValues = Object.values(weight); // tager kun value istedet for key:value i nodens weights

        let cost = weightValues.length > 0 ? Math.min(...weightValues) : 0; // finder den mindste værdi i weightValues arrayet hvis at længden er større end 0 ellers returner 0
        cost = Math.max(0, Math.min(cost, 10)); // clamper for at holde værdien mellem 0 og 10
        const shade = 255 - cost * 25;
        return `rgb(${shade}, ${shade}, ${shade})`; // darker = higher cost
    };

    constructor(graph) {
        const { mapWidth, mapHeight, tileSize } = graph.size;
        
        this.graph = graph;
        this.tileSize = tileSize;
        this.mapWidth = mapWidth;
        this.mapHeight = mapHeight;
        this.margin = 10; 

        this.canvas = document.getElementById("main");
        if (!this.canvas) {
            return alert("Canvas not found!");
        }

        this.ctx = this.canvas.getContext("2d");
        this.canvas.width = window.innerWidth; 
        this.canvas.height = window.innerHeight; // Havde trukket et par pixels fra men endte med at sætte overflow til hidden i css
        this.canvas.style.backgroundColor = "#737373"


        this.startPosition = {
            // center for vores canvas at skrive på.
            // canvas størelse trukket fra udregnet størrelse af vores "map" i pixels (Tror ikke der er nogen scenarier hvor det ikke er centeret)
            // Derefter divideret med 2 for at få det i midten.

            x: (this.canvas.width - (this.mapWidth * this.tileSize + this.margin)) / 2,
            y: (this.canvas.height - (this.mapHeight * this.tileSize + this.margin)) / 2
        };

        console.log("Start Position:", this.startPosition);
    }

    renderFrame() {
        // clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // draw background
        this.ctx.fillStyle = "#737373";
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);


        // draw Text
        this.ctx.fillStyle = "#FFFFFF";
        this.ctx.font = "20px Arial";
        this.ctx.fillText("Graph Visualization", 10, 20);
        this.ctx.fillText("Node Size: " + this.mapWidth * this.mapHeight, 10, 50);
        this.ctx.fillText("Tile Size: " + this.tileSize, 10, 80);
        this.ctx.fillText("Margin: " + this.margin, 10, 110);
        

        // draw grid
        for (const node in g.nodes) {
            const { x, y } = g.nodes[node];

            this.ctx.fillStyle = this.getTileColor(node);
            this.ctx.fillRect(this.startPosition.x + x * (this.tileSize + this.margin), this.startPosition.y + y * (this.tileSize + this.margin), this.tileSize, this.tileSize);
            this.ctx.strokeStyle = "#000000";
            this.ctx.strokeRect(this.startPosition.x + x * (this.tileSize + this.margin), this.startPosition.y + y * (this.tileSize + this.margin), this.tileSize + 5, this.tileSize + 5);
        }
        
        requestAnimationFrame(this.renderFrame.bind(this));
    }


    startRendering() {
        this.renderFrame();
    }

    stopRendering() {
        cancelAnimationFrame(this.renderFrame.bind(this));
    }

}


const size = {
    mapWidth: 9,
    mapHeight: 9,
    tileSize: 50,
};

const g = new Graph();
g.setGraph(g.generateNodeMap(size));


new Render(g).startRendering();