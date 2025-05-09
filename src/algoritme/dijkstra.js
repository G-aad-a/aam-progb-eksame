class dijkstra extends algoritme {
    calculate(startName, targetName) {
        const length = graph.length;
        const nodes = nodes.map(node => {
            return {
                ...node,
                previousNode: null
            };
        });
        
        const hasVisited = [];
        const startNode = graph.find(node => node.name === startName);
        startNode.weight = 0;
    
        while (hasVisited.length < length) {
            this.sortGraph();
            if(!nodes || nodes == [])
                break;
    
            const currentNode = nodes.pop(0)
            if(currentNode in nodes)
                continue;
    
            hasVisited.push(currentNode);
            if(node.name == targetName)
                break;
    
            for(const node in nodes) {
                const neighbourNodes = null; // GetNeighbours(node)
                for(const neighbourNode in neighbourNodes) {
                    const edge = [currentNode, neighbourNode];
                    const weight = node.weight + neighbourNode.weight;
    
                    if(weight < neighbourNode.weight) {
                        neighbourNode.weight = weight;
                        neighbourNode.previousNode = node;
                    }
                } 
            }
        }
        const finalPath = [];
        var targetNode = nodes.find(node => node.name == targetName);
    
        while(targetNode && targetNode != startNode) {
            finalPath.push(targetNode);
            targetNode = null; // GetNode(targetNode.previousNode)
        }
    
        finalPath.push(startNode);
        finalPath.reverse();
    
        return finalPath;
    }
}
