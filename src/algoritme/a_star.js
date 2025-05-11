class Astar {

    constructor() {
        this.nodes = [];
        this.startNode = null;
        this.targetNode = null;
        this.hasVisited = [];
    }

    setGraph(graph) {
        this.graph = graph;

        this.nodes = Object.fromEntries(Object.entries(graph.nodes).map(([key, value]) => {
            return [key, {
                ...value,
                g: Infinity,
                f: Infinity,
                previousNode: null
            }];
        }));

        this.hasVisited = [];
    }

    calculate(startNodeKey, targetNodeKey) {
        if (!this.startNode) {
            this.startNode = this.nodes[startNodeKey];
            this.startNode.g = 0;
            this.startNode.f = this.heuristic(startNodeKey, targetNodeKey);
        }

        if (!this.targetNode) {
            this.targetNode = this.nodes[targetNodeKey];
            this.targetNodeKey = targetNodeKey;
        }

        if (this.hasVisited.length >= Object.keys(this.nodes).length)
            return { status: "unreachable" };

        const unvisited = Object.entries(this.nodes)
            .filter(([key]) => !this.hasVisited.includes(key))
            .sort(([, a], [, b]) => a.f - b.f);

        if (unvisited.length === 0)
            return { status: "unreachable" };

        const [currentKey, currentNode] = unvisited[0];
        this.hasVisited.push(currentKey);

        if (currentKey === targetNodeKey)
            return { status: "done", path: currentKey };

        const neighbours = this.graph.edges[currentKey];
        for (const neighbourKey in neighbours) {
            const weightToNeighbour = this.graph.weights[currentKey][neighbourKey];
            const neighbourNode = this.nodes[neighbourKey];
            const tentativeG = currentNode.g + weightToNeighbour;

            if (tentativeG < neighbourNode.g) {
                neighbourNode.g = tentativeG;
                neighbourNode.f = tentativeG + this.heuristic(neighbourKey, targetNodeKey);
                neighbourNode.previousNode = currentKey;
            }
        }

        return { status: "running", path: this.hasVisited };
    }

    heuristic(nodeKey, targetKey) {
        const node = this.graph.nodes[nodeKey];
        const target = this.graph.nodes[targetKey];
        const dx = node.x - target.x;
        const dy = node.y - target.y;
        return Math.sqrt(dx * dx + dy * dy);
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
