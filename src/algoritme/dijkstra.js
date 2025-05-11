class Dijkstra {

    constructor() {
        this.nodes = [];
        this.startNode = null;
        this.targetNode = null;
        this.hasVisited = [];
        this.unvisitedQueue = [];
    }

    setGraph(graph) {
        this.graph = graph;

        this.nodes = Object.fromEntries(Object.entries(graph.nodes).map(([key, value]) => {
            return [key, {  
                ...value,
                g: Infinity,
                previousNode: null
            }];
        }));

        this.hasVisited = [];
        this.unvisitedQueue = [];
    }

   calculate(startNodeKey, targetNodeKey) {
        // Initialize start and target only once
        if (!this.startNode) {
            this.startNode = this.nodes[startNodeKey];
            this.targetNode = this.nodes[targetNodeKey];
            this.targetNodeKey = targetNodeKey;
            this.startNode.g = 0;

            // Initialize the unvisitedQueue
            this.unvisitedQueue = Object.keys(this.nodes);
        }

        // If nothing left to process, stop
        if (this.unvisitedQueue.length === 0) return false;

        // Sort unvisited by current 'g' cost
        this.unvisitedQueue.sort((aKey, bKey) => {
            return this.nodes[aKey].g - this.nodes[bKey].g;
        });

        const currentKey = this.unvisitedQueue.shift();
        const currentNode = this.nodes[currentKey];

        
        this.hasVisited.push(currentKey);

        // If target found, stop
        if (currentKey === targetNodeKey) return true;

        const neighbours = this.graph.edges[currentKey];
        for (const neighbourKey in neighbours) {
            const weightToNeighbour = this.graph.weights[currentKey][neighbourKey];
            const neighbourNode = this.nodes[neighbourKey];
            const tentativeG = currentNode.g + weightToNeighbour;

            if (tentativeG < neighbourNode.g) {
                neighbourNode.g = tentativeG;
                neighbourNode.previousNode = currentKey;
            }
        }

        return false; // return true if finished
    }

    getShortestPath() {
        const path = [];
        let currentNode = this.targetNodeKey;
        while (currentNode) {
            path.unshift(currentNode);
            currentNode = this.nodes[currentNode].previousNode;
        }

        return path;
    }
}