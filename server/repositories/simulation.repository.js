let readline = require('readline');
let stream = require('stream');

const flattenArray = (arrayOfArrays) => {
    const result = [];
    arrayOfArrays.forEach(array => array.forEach(element => result.push(element)));
    return result;
};

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

    toSquares() {
        return [
            // bottom
            [
                this.N1,
                this.N2,
                this.N3,
                this.N4
            ],
            // down
            [

                this.N5,
                this.N6,
                this.N7,
                this.N8
            ]
        ]
    }
}

module.exports = function (fs) {
    const elementSolidToSquares = (es) => [
            // bottom
            [es.N1, es.N2, es.N3, es.N4],
            // down
            [es.N5, es.N6, es.N7, es.N8],
            // x side left
            [es.N1, es.N5, es.N8, es.N4],
            // x side right
            [es.N2, es.N6, es.N7, es.N3],
            // z side front
            [es.N4, es.N8, es.N7, es.N3],
            // z side back
            [es.N1, es.N5, es.N6, es.N2]
        ],

        elementSolidToTriangles = (es) => flattenArray(
            elementSolidToSquares(es).map((s) => [
                [s[0], s[1], s[2]],
                [s[0], s[2], s[3]]
            ])
        ),

        createThreeJSJson = (xyzArray, tempArray, minXYZTArray, maxXYZTArray) => ({
            "metadata": {"version": 4, "type": "BufferGeometry"},
            "uuid": "AF2ADB07-FBC5-4BAE-AD60-123456789ABC",
            "type": "BufferGeometry",
            "data": {
                "attributes": {
                    "position": {
                        "itemSize": 3,
                        "type": "Float32Array",
                        "array": xyzArray
                    },
                    "temperature": {
                        "itemSize": 3,
                        "type": "Float32Array",
                        "array": tempArray
                    },
                    "minXYZT": {
                        "itemSize": 4,
                        "type": "Float32Array",
                        "array": minXYZTArray
                    },
                    "maxXYZT": {
                        "itemSize": 4,
                        "type": "Float32Array",
                        "array": maxXYZTArray
                    }
                }
            }
        }),

        trianglesToThreeJSJson = (arrayOfTriangles, scale = 100) =>
                createThreeJSJson(
                    flattenArray(
                        arrayOfTriangles.map(triangle =>
                            flattenArray(
                                triangle.map(node => [node.X, node.Y, node.Z].map(n => n * scale))
                            )
                        )
                    ),
                    flattenArray(
                        arrayOfTriangles.map(triangle =>
                            triangle.map(node => Number(node.T))
                        )
                    )
                );


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
        getFileByName: getFileByName,
        flattenArray: flattenArray,
        elementSolidToTriangles: elementSolidToTriangles,
        trianglesToThreeJSJson: trianglesToThreeJSJson
    }
};