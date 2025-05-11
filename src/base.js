
class Graph {
    constructor() {
        this.nodes = {}; // { name: { x, y } }
        this.edges = {}; // { name: { neighborName: weight } }
        this.weights = {}; // { name: { neighborName: weight } }
        this.size = { mapWidth: 0, mapHeight: 0, tileSize: 0 };
        this.searchedNodes = [];
        this.currentNode = null;
        this.algorithm = null;
    }

    #nodeName = (x, y) => `${x},${y}`;

    setGraph(data) {
        if (!data) return;

        this.nodes = data.nodes || this.nodes;
        this.edges = data.edges || this.edges;
        this.weights = data.weights || this.weights;
        this.size = data.size || this.size;
        return this;
    }

    setAlgorithm(algorithm) {
        this.algorithm = algorithm;
        this.algorithm.setGraph(this);
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
        return { shade: `rgb(${shade}, ${shade}, ${shade})`, intShade: shade }; // darker = higher cost
    };

    constructor(graph) {
        const { mapWidth, mapHeight, tileSize } = graph.size;

        this.graph = graph;
        this.tileSize = tileSize;
        this.mapWidth = mapWidth;
        this.mapHeight = mapHeight;
        this.margin = 10;

        this.hasReset = false;

        this.width = this.mapWidth * (this.tileSize + this.margin)
        this.height = this.mapHeight * (this.tileSize + this.margin)

        this.canvas = document.getElementById("main");
        if (!this.canvas) {
            return alert("Canvas not found!");
        }

        this.ctx = this.canvas.getContext("2d");
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight; // Havde trukket et par pixels fra men endte med at sætte overflow til hidden i css
        this.canvas.style.backgroundColor = "#737373"


        const nodeKeys = Object.keys(this.graph.nodes);

        this.startNode = nodeKeys[Math.floor(Math.random() * nodeKeys.length)];
        this.targetNode = nodeKeys[Math.floor(Math.random() * nodeKeys.length)];
    

        this.startPosition = {
            // center for vores canvas at skrive på.
            // canvas størelse trukket fra udregnet størrelse af vores "map" i pixels (Tror ikke der er nogen scenarier hvor det ikke er centeret)
            // Derefter divideret med 2 for at få det i midten.

            x: (this.canvas.width - (this.mapWidth * this.tileSize + this.margin)) / 2,
            y: (this.canvas.height - (this.mapHeight * this.tileSize + this.margin)) / 2
        };

        const buttonWidth = 100;
        const buttonHeight = 30;
        const buttonGap = 20;

        this.currentButton = "Dijkstra"; // Default button

        // Calculate positions based on your layout
        const totalWidth = buttonWidth * 2 + buttonGap;
        const startX = (this.startPosition.x + this.width / 2) - (totalWidth / 2);
        const buttonY = this.startPosition.y + this.height;

        // Save buttons for drawing and clicking
        this.buttons = [
            { label: "Reset", x: startX, y: buttonY, width: buttonWidth, height: buttonHeight },
            { label: "Start", x: startX + buttonWidth + buttonGap, y: buttonY, width: buttonWidth, height: buttonHeight },
            { label: "Dijkstra", x: startX, y: buttonY + buttonHeight + buttonGap, width: buttonWidth, height: buttonHeight },
            { label: "Astar", x: startX + buttonWidth + buttonGap, y: buttonY + buttonHeight + buttonGap, width: buttonWidth, height: buttonHeight },
            { label: "Bellman-Ford", x: startX + 2*buttonWidth + 2*buttonGap, y: buttonY + buttonHeight + buttonGap, width: buttonWidth, height: buttonHeight },
        ];

        console.log("Start Position:", this.startPosition);

        this.hoveredTile = null;
        this.hasFoundOptimalPath = false;

        this.canvas.addEventListener("mousemove", (e) => {
            const rect = this.canvas.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;

            const gridX = Math.floor((mouseX - this.startPosition.x) / (this.tileSize + this.margin));
            const gridY = Math.floor((mouseY - this.startPosition.y) / (this.tileSize + this.margin));

            const nodeName = `${gridX},${gridY}`;
            this.hoveredTile = this.graph.nodes[nodeName] ? nodeName : null;
        });

        this.canvas.addEventListener("click", (e) => {
            if(this.hasReset)
                return;
            
            const rect = this.canvas.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;

            for (const button of this.buttons) {
                if (
                    mouseX >= button.x &&
                    mouseX <= button.x + button.width &&
                    mouseY >= button.y &&
                    mouseY <= button.y + button.height
                ) {
                    if (button.label === "Reset") {
                        this.reset(); 
                    } else if (button.label === "Start") {
                        this.start(); 
                    } else if(button.label === "Dijkstra") {
                        this.graph.setAlgorithm(new Dijkstra());
                        this.currentButton = button.label;
                    } else if(button.label === "Astar") {
                        this.graph.setAlgorithm(new Astar());
                        this.currentButton = button.label;
                    }
                    else if(button.label === "Bellman-Ford") {
                        this.graph.setAlgorithm(new BellmanFord());
                        this.currentButton = button.label;
                    }

                    
                }
            }
        });
        //this.graph.searchedNodes = Object.keys(this.graph.nodes).slice(0, 5); // Simulate some searched nodes
    }

    reset() {
        this.hasReset = true;
        this.stopRendering();
        let g2 = new Graph();
        g2.setGraph(g2.generateNodeMap(size));
        let r  = new Render(g2)
        r.currentButton = null;
        r.startRendering();

    }

    start() {
        if (this.hasFoundOptimalPath || this.isSearching) {
            return; 
        }

        this.i = 0;
        this.isSearching = true;
    }

    renderFrame() {
        if (this.isSearching) {
            this.i++;
            //console.log("i:", this.i);
            if (this.i >= 6) {
                console.log("Searching...");
                if(this.graph.algorithm) {
                    let result = this.graph.algorithm.calculate(this.startNode, this.targetNode);
                    if (typeof result === "object") {
                        this.graph.searchedNodes = result;
                    } else if (result === false) {
                        console.log("No path found");
                        this.isSearching = false;
                    } else if (result === true) {
                        console.log("Path found");
                        this.graph.searchedNodes = this.graph.algorithm.getShortestPath();
                        this.hasFoundOptimalPath = true;
                        this.isSearching = false;
                    }
                    
                    console.log("Searched Nodes:", this.graph.searchedNodes);
                }
                this.i = 0;
            }
        }


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
        for (const node in this.graph.nodes) {
            const { x, y } = this.graph.nodes[node];

            if(this.startNode === node && !this.hasFoundOptimalPath) {
                this.ctx.fillStyle = "#ff0000"; // rød farve
            } else if(this.targetNode === node && !this.hasFoundOptimalPath) {
                this.ctx.fillStyle = "#0000ff"; // blå farve
            } else if (this.graph.searchedNodes.includes(node) && !this.hasFoundOptimalPath) {
                this.ctx.fillStyle = "#facc00"; // gul farve
            } else if (this.hasFoundOptimalPath && this.graph.searchedNodes.includes(node)) {
                this.ctx.fillStyle = "#00ff00"; // grøn farve
            } else {
                this.ctx.fillStyle = this.getTileColor(node).shade;
            }
            this.ctx.fillRect(this.startPosition.x + x * (this.tileSize + this.margin), this.startPosition.y + y * (this.tileSize + this.margin), this.tileSize, this.tileSize);

            this.ctx.strokeRect(this.startPosition.x + x * (this.tileSize + this.margin), this.startPosition.y + y * (this.tileSize + this.margin), this.tileSize + 5, this.tileSize + 5);
        }

        // draw Button
        this.ctx.font = "16px Arial";
        this.ctx.textBaseline = "middle";

        this.buttons.forEach(button => {
            // Draw button background
            if (this.currentButton === button.label) {
                this.ctx.fillStyle = "#008000"; // green highlight color
            } else {
                this.ctx.fillStyle = "#aaaaaa"; // Default color
            }

            this.ctx.fillRect(button.x, button.y, button.width, button.height);

            // Draw border
            this.ctx.strokeStyle = "#000000";
            this.ctx.strokeRect(button.x, button.y, button.width, button.height);

            // Draw centered text
            this.ctx.fillStyle = "#000000";
            const textWidth = this.ctx.measureText(button.label).width;
            const textX = button.x + (button.width - textWidth) / 2;
            const textY = button.y + button.height / 2;

            this.ctx.fillText(button.label, textX, textY);
        });


       // console.log("Hovered Tile:", this.hoveredTile); // DEBUG PURPOSES

        if (this.hoveredTile) {
            const { x, y } = this.graph.nodes[this.hoveredTile];
            const weights = this.graph.weights[this.hoveredTile];

            // Get average or min weight
            const weightList = Object.values(weights);
            const displayWeight = weightList.length ? Math.min(...weightList) : 0;

            // Draw text
            this.ctx.font = "16px sans-serif";
            this.ctx.fillText(
                `W: ${displayWeight}`,
                this.startPosition.x + x * (this.tileSize + this.margin) + 10,
                this.startPosition.y + y * (this.tileSize + this.margin) + 20
            );
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

