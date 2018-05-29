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
                if (!fs.existsSync(filePath)) {
                    reject('File don\'t exist!');
                    return -1;
                }
                let instream = fs.createReadStream(filePath);
                let outstream = new stream;
                let rl = readline.createInterface(instream, outstream);
                let nodes = [];
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
                            nodes.push(new Node(values[0], values[1], values[2], values[3], values[4]))
                        } else {
                            elementSolid.push(new ElementSolid(values[0], values[1], values[2], values[3], values[4], values[5], values[6], values[7], values[8], values[9]))
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