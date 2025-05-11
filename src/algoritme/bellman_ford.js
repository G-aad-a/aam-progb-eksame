class BellmanFord {
    constructor() {
        this.nodes = {};
        this.edges = [];
        this.startNode = null;
        this.targetNode = null;
        this.pass = 0;
        this.edgeIndex = 0;
        this.maxPasses = 0;
        this.finished = false;
    }

    setGraph(graph) {
        this.graph = graph;
        this.nodes = Object.fromEntries(
            Object.entries(graph.nodes).map(([key, value]) => [
                key,
                { ...value, g: Infinity, previousNode: null }
            ])
        );

        this.edges = [];
        for (const [u, neighbors] of Object.entries(graph.edges)) {
            for (const v of Object.keys(neighbors)) {
                this.edges.push([u, v]);
            }
        }

        this.startNode = null;
        this.targetNode = null;
        this.pass = 0;
        this.edgeIndex = 0;
        this.maxPasses = Object.keys(this.nodes).length - 1;
        this.finished = false;
    }


    calculate(startKey, targetKey) {
        if (!this.startNode) {
            this.startNode = startKey;
            this.targetNode = targetKey;
            this.nodes[startKey].g = 0;
        }

        if (this.finished) return;

        if (this.pass >= this.maxPasses) {
            for (const [u, v] of this.edges) {
                const weight = this.graph.weights[u][v];
                if (this.nodes[u].g + weight < this.nodes[v].g) {
                    this.finished = true;
                    return { status: "error", message: "Negative weight cycle detected" };
                }
            }

            this.finished = true;
            return { status: "done", path: this.getShortestPath() };
        }

        let updated = false;
        for (const [u, v] of this.edges) {
            const weight = this.graph.weights[u][v];
            if (this.nodes[u].g + weight < this.nodes[v].g) {
                this.nodes[v].g = this.nodes[u].g + weight;
                this.nodes[v].previousNode = u;
                updated = true;
            }
        }

        this.pass++;

        if (!updated) {
            this.finished = true;
            return { status: "done", path: this.getShortestPath() };
        }

        return { status: "running", path: this.getVisited() };
    }
    
    getVisited() {
        return Object.keys(this.nodes).filter(k => this.nodes[k].g !== Infinity);
    }

    getShortestPath() {
        const path = [];
        let current = this.targetNode;

        while (current) {
            path.unshift(current);
            current = this.nodes[current].previousNode;
        }

        return path.length ? path : null;
    }
}