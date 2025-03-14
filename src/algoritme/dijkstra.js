const algoritme = (graph, startName, targetName) => {
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
        //sort nodes for queue
        if(!nodes || nodes == [])
            break;

        const currentNode = nodes.pop(0)
        if(currentNode in nodes)
            continue;

        hasVisited.push(currentNode);
        if(node.name == targetName)
            break;

        for(node in nodes) {
            
        }
    }

};



    