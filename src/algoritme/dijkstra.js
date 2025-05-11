class Dijkstra {

    constructor() {
        this.nodes = [];
        this.startNode = null;
        this.targetNode = null;
        this.hasVisited = new Set();
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

        this.hasVisited = new Set();
    }

    calculate(startNodeKey, targetNodeKey) {
        if (!this.startNode) {
            this.startNode = this.nodes[startNodeKey];
            this.startNode.g = 0;
        }

        if (!this.targetNode) {
            this.targetNode = this.nodes[targetNodeKey];
            this.targetNodeKey = targetNodeKey;
        }


        if (this.hasVisited.length >= Object.keys(this.nodes).length)
            return { status: "unreachable" };

        const unvisited = Object.entries(this.nodes)
            .filter(([key]) => !this.hasVisited.has(key))
            .sort(([, a], [, b]) => a.g - b.g);

        if (unvisited.length === 0)
            return { status: "unreachable" };

        const [currentKey, currentNode] = unvisited[0];
        this.hasVisited.add(currentKey);

        if (currentKey === targetNodeKey)
            return { status: "done", path: this.getShortestPath() };;

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

        return { status: "running", path: Array.from(this.hasVisited)    };
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