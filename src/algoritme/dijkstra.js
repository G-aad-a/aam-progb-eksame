class Dijkstra {

    constructor() {
        this.nodes = []; // liste over alle noder i grafen
        this.startNode = null; // startnoden for søgningen
        this.targetNode = null; // målnoden for søgningen
        this.hasVisited = new Set(); // set(en collection) til at holde styr på besøgte noder
    }

    // initializer grafen med noder og deres vægte
    setGraph(graph) {
        this.graph = graph;

        // konverterer noder til et format med g-værdi (afstand) f-værdi (total estimat) og tidligere node
        this.nodes = Object.fromEntries(Object.entries(graph.nodes).map(([key, value]) => {
            return [key, {  
                ...value,
                g: Infinity, // initializer afstanden til uendelig
                previousNode: null // holder styr på den tidligere node i den korteste path
            }];
        }));

        this.hasVisited = new Set();
    }

    // beregner den korteste path mellem startNode og targetNode
    calculate(startNodeKey, targetNodeKey) {
        // initializer startnoden hvis den ikke allerede er sat
        if (!this.startNode) {
            this.startNode = this.nodes[startNodeKey];
            this.startNode.g = 0; // sætter afstanden til startnoden til 0
        }

        // initializer målnoden hvis den ikke allerede er sat
        if (!this.targetNode) {
            this.targetNode = this.nodes[targetNodeKey];
            this.targetNodeKey = targetNodeKey;
        }

        // tjekker om målet er unreachable
        if (this.hasVisited.length >= Object.keys(this.nodes).length)
            return { status: "unreachable" };

        // finder den unvisited node med den mindste f-værdi
        const unvisited = Object.entries(this.nodes)
            .filter(([key]) => !this.hasVisited.has(key))
            .sort(([, a], [, b]) => a.g - b.g);

        if (unvisited.length === 0)
            return { status: "unreachable" };

        const [currentKey, currentNode] = unvisited[0];
        this.hasVisited.add(currentKey);

        // hvis vi har nået målet returnerer vi den korteste path
        if (currentKey === targetNodeKey)
            return { status: "done", path: this.getShortestPath() };;


        console.log(this.graph.weights);
        // opdaterer afstande og f-værdier for nabonoder
        const neighbours = this.graph.edges[currentKey];
        for (const neighbourKey in neighbours) {
            console.log(neighbourKey, currentKey);

            const weightToNeighbour = this.graph.weights[neighbourKey];
            const neighbourNode = this.nodes[neighbourKey];
            const tentativeG = currentNode.g + weightToNeighbour;

            // hvis vi finder en kortere path opdaterer vi den
            if (tentativeG < neighbourNode.g) {
                console.log(`Updating node ${neighbourKey} from ${neighbourNode.g} to ${tentativeG} w ${weightToNeighbour}`);
                neighbourNode.g = tentativeG;
                neighbourNode.previousNode = currentKey;
            }
        }

        return { status: "running", path: Array.from(this.hasVisited)    };
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