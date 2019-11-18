const ToolsPalette = {
    canvas: null,

    tools: {
        pencil: null,
        fillBucket: null,
        pipette: null
    },

    _initTools() {
        this.pencil = document.querySelector('#pencil');
        this.fillBucket = document.querySelector('paint_bucket');
        this.pipette = document.querySelector('#pipette');
    },

    _initCanvas(canvas) {
        this.canvas =
            // Palette.canvasProperties.canvas.toDataURL()
    },

    _draw() {
        // Palette.canvasProperties.ctx.beginPath();
        ToolsPalette._currentTile(event.offsetX, event.offsetY);
        const x = Palette.tile.tileWidth * Palette.tile.currentTileX,
            y = Palette.tile.tileHeight * Palette.tile.currentTileY;

        Palette.canvasProperties.ctx.fillStyle = Palette.colors.currentColor;

        Palette.canvasProperties.ctx.fillRect(x, y, Palette.tile.tileWidth, Palette.tile.tileHeight);
        // Palette._saveState();
    },

    _redraw(xParam, yParam) {
        Palette._currentTile(xParam, yParam);
        const x = Palette.tile.tileWidth * Palette.tile.currentTileX,
            y = Palette.tile.tileHeight * Palette.tile.currentTileY;

        Palette.canvasProperties.ctx.fillStyle = Palette.colors.currentColor;
        Palette.canvasProperties.ctx.fillRect(x, y, Palette.tile.tileWidth, Palette.tile.tileHeight);
        Palette._saveState();

    },

    _changeColorProperties(value) {
        const prev_color = document.querySelector('#prev_color'),
            current_color = document.querySelector('#current_color');
        if (Palette._hexToRGB(value) == current_color.style.background) return;
        Palette.colors.prevColor = Palette.colors.currentColor;
        Palette.colors.currentColor = value;
        prev_color.style.background = Palette.colors.prevColor;
        current_color.style.background = Palette.colors.currentColor;
        Palette._saveState();
    },

    _pipette() {
        const data_color = Palette.canvasProperties.ctx.getImageData(event.offsetX, event.offsetY, 1, 1).data;
        const color = Palette._rgbToHex(data_color[0], data_color[1], data_color[2]);
        Palette._changeColorProperties(color);
        Palette._saveState();

    },

    _fillBucket() {
        const colorOld = Palette.canvasProperties.ctx.getImageData(event.offsetX, event.offsetY, 1, 1).data;
        const colorNew = Palette.colors.currentColor;
        Palette._floodFill(event.offsetX, event.offsetY, colorOld, colorNew);
        Palette._saveState();

    },

    _floodFill(x, y, oldColor, newColor) {
        Palette._currentTile(x, y);
        const c_tile_x = Palette.tile.currentTileX,
            c_tile_y = Palette.tile.currentTileY;
        if (c_tile_x < 0 || c_tile_y < 0 || c_tile_x >= Palette.tile.columns || c_tile_y >= Palette.tile.rows) return;
        let data_color = Palette.canvasProperties.ctx.getImageData(x, y, 1, 1).data;
        if (Palette._rgbToHex(data_color[0], data_color[1], data_color[2]) != Palette._rgbToHex(oldColor[0], oldColor[1], oldColor[2])) return;
        Palette._redraw(x, y);

        this._floodFill(x - Palette.tile.tileWidth, y, oldColor, newColor);
        this._floodFill(x + Palette.tile.tileWidth, y, oldColor, newColor);
        this._floodFill(x, y + Palette.tile.tileHeight, oldColor, newColor);
        this._floodFill(x, y - Palette.tile.tileHeight, oldColor, newColor);
    },
}