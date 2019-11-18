const CanvasPalette = {
    matrix: {
        x: 0,
        y: 0
    },

    size: {
        x: 0,
        y: 0
    },

    canvasProperties: {
        canvas: null,
        ctx: null,
        canvasWidth: 0,
        canvasHeight: 0,
        canvasStyleWidth: 0,
        canvasStyleHeight: 0
    },

    tile: {
        columns: 0,
        rows: 0,
        tileWidth: 0,
        tileHeight: 0,
        currentTileX: 0,
        currentTileY: 0
    },

    _createCanvas(width, height) {
        console.log('create canvas');
        this.canvasProperties.canvas = document.querySelector('#canvas');
        this.canvasProperties.ctx = this.canvasProperties.canvas.getContext('2d');
        this.canvasProperties.canvas.backgroundColor = 'white';

        this._initCanvasProperties(width, height);
        this._styleCanvas();
        this._initMatrix();
        this._initTile();
    },

    _initCanvasProperties(width, height) {
        this.canvasProperties.canvasWidth = width;
        this.canvasProperties.canvasHeight = height;

        this.canvasProperties.canvas.width = this.canvasProperties.canvasWidth;
        this.canvasProperties.canvas.height = this.canvasProperties.canvasHeight;
    },

    _styleCanvas() {
        this.canvasProperties.canvas.style.width = `${this.canvasProperties.canvasWidth}px`;
        this.canvasProperties.canvas.style.height = `${this.canvasProperties.canvasHeight}px`;

        this.canvasProperties.canvasStyleWidth = this.canvasProperties.canvas.style.width;
        this.canvasProperties.canvasStyleHeight = this.canvasProperties.canvas.style.height;
    },

    _initMatrix() {
        // this.matrix.x = Math.floor(CanvasPalette.canvasProperties.canvasStyleWidth / CanvasPalette.canvasProperties.canvasWidth);
        // this.matrix.y = Math.floor(CanvasPalette.canvasProperties.canvasStyleHeight / CanvasPalette.canvasProperties.canvasHeight);     
        this.matrix.x = CanvasPalette.canvasProperties.canvasStyleWidth / CanvasPalette.canvasProperties.canvasWidth;
        this.matrix.y = CanvasPalette.canvasProperties.canvasStyleHeight / CanvasPalette.canvasProperties.canvasHeight;
    },

    _initTile() {
        this.tile.columns = this.matrix.x;
        this.tile.rows = this.matrix.y;
        console.log('VERY', this.tile.columns, this.tile.rows)

        this.tile.tileWidth = Math.round(this.canvasProperties.canvasWidth / this.tile.columns);
        this.tile.tileHeight = Math.round(this.canvasProperties.canvasHeight / this.tile.rows);
    }
}

window.addEventListener("DOMContentLoaded", function() {
    CanvasPalette._createCanvas(512, 512);
});