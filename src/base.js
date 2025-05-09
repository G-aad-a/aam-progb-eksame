class GraphNode {
    constructor(name) {
        this.name = name;
        this.neighbours = new Map();
    }
}


class Graph {
    constructor() {
        this.nodes = new Map();
    
        this.nameIndex = 0;
    }

    addNode(name) {
        const node = new GraphNode(name);
        this.nodes.set(name, node);
        return node;
    }

    addEdge(node1, node2, weight) {
        if (!this.nodes.has(node1) || !this.nodes.has(node2)) {
            throw new Error("One or both nodes do not exist in the graph.");
        }
        this.nodes.get(node1).neighbours.set(node2, weight);
        this.nodes.get(node2).neighbours.set(node1, weight); // antagelse er det ikke er rettet graf 
    }

    #generateName() {
        let tmp_id = this.nameIndex % 26;
        let tmp_name = String.fromCharCode(65 + tmp_id);
        this.nameIndex++;

        return tmp_name + (tmp_id + 1);
    }


    #getRandomIndex(max) {
        return Math.floor(Math.random() * max);
    }

    #getRandomNode(nodes) {
        if(nodes.length == 0) {
            return null;
        }
        let index = this.#getRandomIndex(nodes.length);
        return nodes[index];
    }


    generateNodes(nodeLen, edgeLen) {
        var nodes = {};
        var edges = {};
        var weights = {};
        var previousNode = null;

        for(let i = 0; i < nodeLen; i++) {
            let name = this.#generateName();
            nodes[name] = new GraphNode(name); 
            this.addNode(name);
            
            if(i > 0) {
                let edge = nodes[name].name + previousNode.name;
                let weight = Math.floor(Math.random() * 10) + 1; // tilfædig weight mellem 1 og 10
                weights[edge] = weight;
                edges[name] = previousNode.name;
                this.addEdge(name, previousNode.name, weight);

            }
            previousNode = nodes[name];
        }

        let extraEdges = edgeLen - nodeLen; // ekstra edges der skal tilføjes
        console.log("Extra edges: ", extraEdges);
        if(extraEdges > 0) {
            for(let i = 1; i < (extraEdges); i++) {
                let node = this.#getRandomNode(Object.values(nodes));
                let node2 = this.#getRandomNode(Object.values(nodes));
    
                let weight = Math.floor(Math.random() * 10) + 1; // tilfædig weight mellem 1 og 10
                let edge = node.name + node2.name;
    
                if(node == node2) {
                    continue;
                }
    
                edges[node.name] = node2.name;
                weights[edge] = weight;
    
                this.addEdge(node.name, node2.name, weight);
            }
        }
       

        console.log("Graph: ", this.nodes);

    }
}


new Graph().generateNodes(10, 15);


class algoritme {
    constructor(graph) {
        this.graph = graph;
    }                       
    
    #sortGraph() {
        this.graph.sort((a, b) => a.weight - b.weight);
    }

    #getNodeByName(name) {
        for(const node in this.graph) {
            if(node.name == name) {
                return node;
            }
        }
        return null;
    }

    getNode(node) {
        if (typeof node == 'string') {
            return this.#getNodeByName(node);
        } else if(node instanceof GraphNode) {
            return node;
        }

    }

    getNeighbours(node) {
        for(const node in this.graph) {
            
        }
    }
    
};