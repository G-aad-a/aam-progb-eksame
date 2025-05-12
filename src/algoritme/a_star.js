class Astar {

    constructor() {
        this.nodes = []; // liste over alle noder i grafen
        this.startNode = null; // startnoden for søgningen
        this.targetNode = null; // målnoden for søgningen
        this.visited = new Set(); // set(en collection) til at holde styr på besøgte noder
    }

    // initializer grafen med noder og deres vægte
    setGraph(graph) {
        this.graph = graph;

        // konverterer noder til et format med g-værdi (afstand) f-værdi (total estimat) og tidligere node
        this.nodes = Object.fromEntries(Object.entries(graph.nodes).map(([key, value]) => {
            return [key, {
                ...value,
                g: Infinity, // initializer afstanden til uendelig
                f: Infinity, // initializer det totale estimat til uendelig
                previousNode: null // holder styr på den tidligere node i den korteste path
            }];
        }));

        this.visited = new Set();
    }

    // beregner den korteste path mellem startNode og targetNode
    calculate(startNodeKey, targetNodeKey) {
        // initializer startnoden hvis den ikke allerede er sat
        if (!this.startNode) {
            this.startNode = this.nodes[startNodeKey];
            this.startNode.g = 0; // sætter afstanden til startnoden til 0
            this.startNode.f = this.heuristic(startNodeKey, targetNodeKey); // beregner den oprindelige f-værdi
        }

        // initializer målnoden hvis den ikke allerede er sat
        if (!this.targetNode) {
            this.targetNode = this.nodes[targetNodeKey];
            this.targetNodeKey = targetNodeKey;
        }

        // tjekker om målet er unreachable
        if (this.visited.length >= Object.keys(this.nodes).length)
            return { status: "unreachable" };

        // finder den unvisited node med den mindste f-værdi
        const unvisited = Object.entries(this.nodes)
            .filter(([key]) => !this.visited.has(key))
            .sort(([, a], [, b]) => a.f - b.f);

        if (unvisited.length === 0)
            return { status: "unreachable" };

        const [currentKey, currentNode] = unvisited[0];
        this.visited.add(currentKey);

        // hvis vi har nået målet returnerer vi den korteste path
        if (currentKey === targetNodeKey)
            return { status: "done", path: this.getShortestPath() };

        // opdaterer afstande og f-værdier for nabonoder
        const neighbours = this.graph.edges[currentKey];
        for (const neighbourKey in neighbours) {
            const weightToNeighbour = this.graph.weights[currentKey][neighbourKey];
            const neighbourNode = this.nodes[neighbourKey];
            const tentativeG = currentNode.g + weightToNeighbour;

            // hvis vi finder en kortere path opdaterer vi den
            if (tentativeG < neighbourNode.g) {
                neighbourNode.g = tentativeG;
                neighbourNode.f = tentativeG + this.heuristic(neighbourKey, targetNodeKey);
                neighbourNode.previousNode = currentKey;
            }
        }

        return { status: "running", path: Array.from(this.visited) };
    }

    // beregner den euklidiske afstand mellem to noder som heuristik
    heuristic(nodeKey, targetKey) {
        const node = this.graph.nodes[nodeKey];
        const target = this.graph.nodes[targetKey];
        const dx = node.x - target.x;
        const dy = node.y - target.y;
        return Math.sqrt(dx * dx + dy * dy);
    }

    // viser den korteste path fra start til mål
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
