let readline = require('readline');
let stream = require('stream');

class Node {
    constructor(id, x, y, z, T) {
        this.Id = id;
        this.X = x;
        this.Y = y;
        this.Z = z;
        this.T = T;
    }
}

class ElementSolid {
    constructor(id, s, n1, n2, n3, n4, n5, n6, n7, n8) {
        this.Id = id;
        this.S = s;
        this.N1 = n1;
        this.N2 = n2;
        this.N3 = n3;
        this.N4 = n4;
        this.N5 = n5;
        this.N6 = n6;
        this.N7 = n7;
        this.N8 = n8;
    }
}

module.exports = function (fs) {
    let getFileByName = (fileName) => {
        return new Promise((resolve, reject) => {
            try {
                let filePath = './server/sim_files/temperature ' + fileName + '.k';
                console.log(__dirname, filePath);
                if (!fs.existsSync(filePath)) {
                    reject('File doesn\'t exist!');
                    return -1;
                }
                let instream = fs.createReadStream(filePath);
                let outstream = new stream;
                let rl = readline.createInterface(instream, outstream);
                let nodes = {};
                let elementSolid = [];
                let isNodeData;
                let isEnd;

                rl.on('line', function (line) {
                    let values = line.replace(/\s/g, '').split(',');
                    switch (line) {
                        case '*NODE':
                            isNodeData = true;
                            break;
                        case '*ELEMENT_SOLID':
                            isNodeData = false;
                            break;
                        case '*END ':
                            isEnd = true;
                            break;
                    }

                    if (!isEnd) {
                        if (isNodeData) {
                            nodes[values[0]] = new Node(values[0], values[1], values[2], values[3], values[4]);
                        } else {
                            elementSolid.push(new ElementSolid(values[0], values[1], nodes[values[2]], nodes[values[3]], nodes[values[4]], nodes[values[5]], nodes[values[6]], nodes[values[7]], nodes[values[8]], nodes[values[9]]))
                        }
                    }
                });

                rl.on('close', function () {
                    resolve({nodes: nodes, elementSolid: elementSolid});
                });
            }
            catch (e) {
                reject(e);
            }
        });
    };

    return {
        getFileByName: getFileByName
    }
};