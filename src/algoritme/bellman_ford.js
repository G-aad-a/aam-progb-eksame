// src/algoritme/bellmanford.js

class BellmanFord {
    constructor() {
        this.nodes = {};
        this.startNode = null;
        this.targetNode = null;
        this.hasVisited = [];
        this.finished = false;

        this.edges = [];      // Liste over alle kanter
        this.edgeIndex = 0;   // Hvilken kant vi er på
        this.pass = 0;        // Hvilket gennemløb vi er i
    }

    setGraph(graph) {
        this.graph = graph;
        this.nodes = Object.fromEntries(
            Object.entries(graph.nodes).map(([key, value]) => [
                key,
                { ...value, g: Infinity, previousNode: null }
            ])
        );
        this.startNode = null;
        this.targetNode = null;
        this.hasVisited = [];
        this.finished = false;
        this.pass = 0;
        this.edgeIndex = 0;

        // Generér kantliste
        this.edges = [];
        for (const [u, neighbors] of Object.entries(graph.edges)) {
            for (const v of Object.keys(neighbors)) {
                this.edges.push([u, v]);
            }
        }
    }

    calculate(startNodeKey, targetNodeKey) {
    if (this.finished) {
        return true;
    }

    if (!this.startNode) {
        this.startNode = startNodeKey;
        this.targetNode = targetNodeKey;
        this.nodes[startNodeKey].g = 0;
    }

    if (this.pass >= Object.keys(this.nodes).length - 1) {
        this.finished = true;
        return true;
    }

    // Behandl ALLE kanter i ét gennemløb
    
    if (this.edgeIndex < this.edges.length) {
            const [u, v] = this.edges[this.edgeIndex];
            const weight = this.graph.weights[u][v];
            if (this.nodes[u].g + weight < this.nodes[v].g) {
                this.nodes[v].g = this.nodes[u].g + weight;
                this.nodes[v].previousNode = u;
            }
            this.edgeIndex++;
        }
    

    
    this.hasVisited = Object.keys(this.nodes).filter(k => this.nodes[k].g !== Infinity);
    return this.hasVisited;
}

    getShortestPath() {
        const path = [];
        let currentNode = this.targetNode;
        while (currentNode) {
            path.unshift(currentNode);
            currentNode = this.nodes[currentNode].previousNode;
        }
        return path;
    }
}

    

