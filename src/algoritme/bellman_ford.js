// Bellman-Ford algoritme - En algoritme der kan håndtere negative vægte og finde negative cykler
class BellmanFord {
    constructor() {
        this.nodes = {}; // liste over alle noder i grafen
        this.edges = []; // liste over alle kanter i grafen
        this.startNode = null; // startnoden for søgningen
        this.targetNode = null; // målnoden for søgningen
        this.pass = 0; // tæller for antal gennemløb
        this.edgeIndex = 0; // indeks for nuværende kant
        this.maxPasses = 0; // maksimalt antal gennemløb (antal noder - 1)
        this.finished = false; // flag der indikerer om algoritmen er færdig
    }

    // initializer grafen med noder og deres vægte
    setGraph(graph) {
        this.graph = graph;
        // konverterer noder til et format med g-værdi (afstand) og tidligere node
        this.nodes = Object.fromEntries(
            Object.entries(graph.nodes).map(([key, value]) => [
                key,
                { ...value, g: Infinity, previousNode: null }
            ])
        );

        // opretter en liste over alle kanter i grafen
        this.edges = [];
        for (const [u, neighbors] of Object.entries(graph.edges)) {
            for (const v of Object.keys(neighbors)) {
                this.edges.push([u, v]);
            }
        }

        // nulstiller algoritmens tilstand
        this.startNode = null;
        this.targetNode = null;
        this.pass = 0;
        this.edgeIndex = 0;
        this.maxPasses = Object.keys(this.nodes).length - 1;
        this.finished = false;
    }

    // beregner den korteste path mellem startNode og targetNode
    calculate(startKey, targetKey) {
        // initializer startnoden hvis den ikke allerede er sat
        if (!this.startNode) {
            this.startNode = startKey;
            this.targetNode = targetKey;
            this.nodes[startKey].g = 0; // sætter afstanden til startnoden til 0
        }

        if (this.finished) return;

        // tjekker for negative cykler efter maksimalt antal gennemløb
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

        // opdaterer afstande for alle kanter
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

        // hvis ingen opdateringer blev foretaget er vi færdige
        if (!updated) {
            this.finished = true;
            return { status: "done", path: this.getShortestPath() };
        }

        return { status: "running", path: this.getVisited() };
    }
    
    // returnerer en liste over besøgte noder
    getVisited() {
        return Object.keys(this.nodes).filter(k => this.nodes[k].g !== Infinity);
    }

    // viser den korteste path fra start til mål
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