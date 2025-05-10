class Dijkstra {

    constructor() {
        this.nodes = [];
        this.startNode = null;
        this.targetNode = null;
        this.hasVisited = [];
    }

    setGraph(graph) {
        this.graph = graph;
        console.log(graph.nodes);

        this.nodes = Object.fromEntries(Object.entries(graph.nodes).map(([key, value]) => {
            return [key, {
                ...value,
                weight: Infinity,
                previousNode: null
            }];
        }));

        this.hasVisited = [];
    }

    calculate(startNodeKey, targetNodeKey) {
        if (!this.startNode) {
            this.startNode = this.nodes[startNodeKey];
            this.startNode.weight = 0;
        }
    
        if (!this.targetNode) {
            this.targetNode = this.nodes[targetNodeKey];
            this.targetNodeKey = targetNodeKey;
        }
        if (this.hasVisited.length >= Object.keys(this.nodes).length)
            return this.hasVisited;
    

        // skal simplificeres
        const unvisited = Object.entries(this.nodes)
            .filter(([key]) => !this.hasVisited.includes(key))
            .sort(([, a], [, b]) => a.weight - b.weight);
    
        if (unvisited.length === 0)
            return false;
    
        const [currentKey, currentNode] = unvisited[0];
        this.hasVisited.push(currentKey);
    
        if (currentKey === targetNodeKey)
            return true;
    
        const neighbours = this.graph.edges[currentKey];
        for (const neighbourKey in neighbours) {
            const weightToNeighbour = neighbours[neighbourKey]; // e.g., 2
            const neighbourNode = this.nodes[neighbourKey];
            const totalWeight = currentNode.weight + weightToNeighbour;
    
            if (totalWeight < neighbourNode.weight) {
                neighbourNode.weight = totalWeight;
                neighbourNode.previousNode = currentKey;
            }
        }
    
        return this.hasVisited;
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
