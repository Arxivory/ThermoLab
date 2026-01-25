export interface SparseMatrix {
    values: Float32Array;
    colIndices: Int32Array;
    rowPtrs: Int32Array;
}

export class MatrixAssembler {
    static assemble(objects: any[]): SparseMatrix {
        return {
            values: new Float32Array(),
            colIndices: new Int32Array(),
            rowPtrs: new Int32Array()
        }
    }
}