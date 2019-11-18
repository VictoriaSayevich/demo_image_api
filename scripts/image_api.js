const Palette = {
    canvasProperties: {
        canvas: null,
        ctx: null,
        canvasWidth: 0,
        canvasHeight: 0,
        canvasStyleWidth: 0,
        canvasStyleHeight: 0
    },

    colors: {
        currentColor: '#757575',
        prevColor: '#757575',
        firstColor: '#F74141',
        secondColor: '#41B6F7'
    },

    image: {
        url: null,
        searchCityName: 'Minsk'
    },

    _createCanvas(width, height) {
        this.canvasProperties.canvas = document.querySelector('#canvas');
        this.canvasProperties.ctx = this.canvasProperties.canvas.getContext('2d');
        this.canvasProperties.canvas.backgroundColor = 'white';

        this._initCanvasProperties(width, height);
        this._styleCanvas();
        this._styleColors();
        this._events();
    },

    _initCanvasProperties(width, height) {
        this.canvasProperties.canvasWidth = width;
        this.canvasProperties.canvasHeight = height;

        this.canvasProperties.canvas.width = this.canvasProperties.canvasWidth;
        this.canvasProperties.canvas.height = this.canvasProperties.canvasHeight;
    },

    _styleColors() {
        document.querySelector('#current_color').style.background = Palette.colors.currentColor;
        document.querySelector('#prev_color').style.background = Palette.colors.prevColor;
    },

    _styleCanvas() {
        this.canvasProperties.canvas.style.width = `${this.canvasProperties.canvasWidth}px`;
        this.canvasProperties.canvas.style.height = `${this.canvasProperties.canvasHeight}px`;

        this.canvasProperties.canvasStyleWidth = this.canvasProperties.canvasWidth;
        this.canvasProperties.canvasStyleHeight = this.canvasProperties.canvasHeight;
    },

    _initState() {
        Palette.colors.currentColor = localStorage.getItem('current_color');
        Palette.colors.prevColor = localStorage.getItem('prev_color');
        Palette.canvasProperties.canvasWidth = localStorage.getItem('canvasWidth');
        Palette.canvasProperties.canvasHeight = localStorage.getItem('canvasHeight');
        Palette.image.url = localStorage.getItem('image_url');

        const img = new Image();
        img.src = localStorage.getItem('canvas');
        img.addEventListener('load', () => {
            Palette._loadImage();
        });
    },

    _saveState() {
        localStorage.setItem('current_color', Palette.colors.currentColor);
        localStorage.setItem('prev_color', Palette.colors.prevColor);
        localStorage.setItem('canvas', Palette.canvasProperties.canvas.toDataURL());
        localStorage.setItem('image_url', Palette.canvasProperties.canvas.toDataURL());
        localStorage.setItem('canvasWidth', Palette.canvasProperties.canvasWidth);
        localStorage.setItem('canvasHeight', Palette.canvasProperties.canvasHeight);
    },

    _events_tools() {
        Palette._event('#paint_bucket', ['#pencil', '#pipette'], 'mousedown', 'mousedown', [this._fillBucket], [this._draw, this._pipette], 'active');
        Palette._event('#pipette', ['#paint_bucket', '#pencil'], 'mousedown', 'mousedown', [this._pipette], [this._fillBucket, this._draw], 'active');
        Palette._event('#pencil', ['#paint_bucket', '#pipette'], 'mousedown', 'mousedown', [this._draw], [this._fillBucket, this._pipette], 'active');

        const pencil = document.querySelector('#pencil');
        pencil.addEventListener('mousedown', () => {
            Palette._removeEvents([this._fillBucket, this._pipette], 'mousedown');
            Palette._removeClass(['#paint_bucket', '#pipette'], 'active');
            pencil.classList.add('active');
            Palette.canvasProperties.canvas.addEventListener('mousedown', () => {
                Palette.canvasProperties.canvas.addEventListener('mousemove', this._draw);
            });
            Palette.canvasProperties.canvas.addEventListener('mouseup', () => {
                Palette.canvasProperties.canvas.removeEventListener('mousemove', this._draw);
            });

        });
    },

    _events_colors() {
        document.querySelector('#current_color_input').addEventListener('input', () => {
            Palette._changeColorProperties(document.querySelector('#current_color_input').value);
        });
        document.querySelector('#first_color').addEventListener('mousedown', () => {
            Palette._changeColorProperties(Palette.colors.firstColor);
        });
        document.querySelector('#second_color').addEventListener('mousedown', () => {
            Palette._changeColorProperties(Palette.colors.secondColor);
        });
        document.querySelector('#prev_color').addEventListener('mousedown', () => {
            Palette._changeColorProperties(Palette.colors.prevColor);
        });
    },

    _events_keys() {
        document.addEventListener('keydown', () => {
            if (event.code == 'KeyP') {
                Palette._removeEvents([this._pipette, this._draw], 'mousedown');
                Palette._removeClass(['#pipette', '#pencil'], 'active');
                document.querySelector('#paint_bucket').classList.add('active');
                document.querySelector('#canvas').addEventListener('mousedown', this._fillBucket);
            }
            if (event.code == 'KeyI') {
                Palette._removeEvents([this._fillBucket, this._draw], 'mousedown');
                Palette._removeClass(['#paint_bucket', '#pencil'], 'active');
                document.querySelector('#pipette').classList.add('active');
                document.querySelector('#canvas').addEventListener('mousedown', this._pipette);
            }
            if (event.code == 'KeyB') {
                Palette._removeEvents([this._fillBucket, this._pipette], 'mousedown');
                Palette._removeClass(['#paint_bucket', '#pipette'], 'active');
                document.querySelector('#pencil').classList.add('active');
                document.querySelector('#canvas').addEventListener('mousedown', this._draw);
            }
        });
    },

    _event_input() {
        const form = document.querySelector('#form_search_city');
        form.onsubmit = function() {
            const city_text = form.search_city.value;
            if (city_text == '') return false;

            Palette.image.searchCityName = city_text;
            document.onkeydown = null;
            Palette._image_load();
            return false;
        };
    },

    _image_load() {
        const image = new Image();
        Palette._getLinkToImage()
            .then(
                response => {
                    image.src = response;
                    Palette.image.url = image.src;
                },
                error => {
                    console.log(error);
                },
            )
            .then(
                () => {
                    Palette._loadImage(image.src);
                },
                error => {
                    console.log(error);
                },
            )
    },

    _events_image_load() {
        document.querySelector('#load_button').addEventListener('mousedown', () => {
            Palette._image_load();
            Palette._saveState();
        });
    },

    _event_clear() {
        document.querySelector('#clear').addEventListener('mousedown', () => {
            Palette.canvasProperties.ctx.clearRect(0, 0, Palette.canvasProperties.canvasWidth, Palette.canvasProperties.canvasHeight);
        });
    },

    _events_choose_size() {
        const size_range = document.querySelector('#canvas_size');
        size_range.addEventListener('change', () => {
            Palette._saveState();
            Palette._initCanvasProperties(size_range.value, size_range.value);
            Palette.image.url = localStorage.getItem('image_url');
            Palette._loadImage(Palette.image.url);
        });
    },

    _events() {
        Palette._events_tools();
        Palette._events_colors();
        Palette._events_keys();
        Palette._events_image_load();
        Palette._events_choose_size();
        Palette._event_input();
        Palette._event_clear();
    },

    _event(element, arrElementToRemove, doEvent, removeEvent, arrToDo, arrToRemove, classActive = '') {
        document.querySelector(element).addEventListener(doEvent, () => {
            document.querySelector(element).classList.add(classActive);
            for (let i = 0; i < arrToDo.length; i++) {
                this.canvasProperties.canvas.addEventListener(doEvent, arrToDo[i]);
            }
            Palette._removeEvents(arrToRemove, removeEvent);
            Palette._removeClass(arrElementToRemove, classActive);
        });
    },

    _removeEvents(arrEventsToRemove, removeEvent) {
        for (let i = 0; i < arrEventsToRemove.length; i++) {
            this.canvasProperties.canvas.removeEventListener(removeEvent, arrEventsToRemove[i]);
        }
    },

    _removeClass(arrElementsToRemoveClass, classToRemove) {
        for (let i = 0; i < arrElementsToRemoveClass.length; i++) {
            document.querySelector(arrElementsToRemoveClass[i]).classList.remove(classToRemove);
        }
    },

    _draw() {
        Palette.canvasProperties.ctx.fillStyle = Palette.colors.currentColor;

        const x = Math.floor(event.offsetX / (Palette.canvasProperties.canvasStyleWidth / Palette.canvasProperties.canvasWidth)),
            y = Math.floor(event.offsetY / (Palette.canvasProperties.canvasStyleHeight / Palette.canvasProperties.canvasHeight));

        Palette.canvasProperties.ctx.fillRect(x, y, 1, 1);
        Palette._saveState();
    },

    _redraw(xParam, yParam) {
        const columns = Math.round(Palette.canvasProperties.canvasStyleWidth / Palette.canvasProperties.canvasWidth),
            rows = Math.round(Palette.canvasProperties.canvasStyleHeight / Palette.canvasProperties.canvasHeight);
        const tileWidth = Math.round(this.canvasProperties.canvasWidth / columns),
            tileHeight = Math.round(this.canvasProperties.canvasHeight / rows);
        const currentTileX = Math.floor(xParam / tileWidth),
            currentTileY = Math.floor(yParam / tileHeight);

        const x = tileWidth * currentTileX,
            y = tileHeight * currentTileY;

        Palette.canvasProperties.ctx.fillStyle = Palette.colors.currentColor;
        Palette.canvasProperties.ctx.fillRect(x, y, tileWidth, tileHeight);
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
    },

    _pipette() {
        const x = Math.floor(event.offsetX / (Palette.canvasProperties.canvasStyleWidth / Palette.canvasProperties.canvasWidth)),
            y = Math.floor(event.offsetY / (Palette.canvasProperties.canvasStyleHeight / Palette.canvasProperties.canvasHeight));
        const data_color = Palette.canvasProperties.ctx.getImageData(x, y, 1, 1).data;
        const color = Palette._rgbToHex(data_color[0], data_color[1], data_color[2]);
        Palette._changeColorProperties(color);
    },

    _rgbToHex(r, g, b) {
        return "#" + this._componentToHex(r) + this._componentToHex(g) + this._componentToHex(b);
    },

    _componentToHex(component) {
        const hex = component.toString(16);
        return hex.length == 1 ? "0" + hex : hex;
    },

    _hexToRGB(hex) {
        const hex_code = hex.replace("#", "");
        let rgb = '';

        let r = parseInt(hex_code.slice(0, 2), 16),
            g = parseInt(hex_code.slice(2, 4), 16),
            b = parseInt(hex_code.slice(4, 6), 16);

        rgb = rgb.concat('rgb(').concat(r + ', ').concat(g + ', ').concat(b + ')');
        return rgb;
    },

    _fillBucket() {
        const x = Math.floor(event.offsetX / (Palette.canvasProperties.canvasStyleWidth / Palette.canvasProperties.canvasWidth)),
            y = Math.floor(event.offsetY / (Palette.canvasProperties.canvasStyleHeight / Palette.canvasProperties.canvasHeight));

        const colorOld = Palette.canvasProperties.ctx.getImageData(event.offsetX, event.offsetY, 1, 1).data;
        const colorNew = Palette.colors.currentColor;

        Palette._floodFill(x, y, colorOld, colorNew);
        Palette._saveState();

    },

    _floodFill(x, y, oldColor, newColor) {
        const columns = Math.round(Palette.canvasProperties.canvasStyleWidth / Palette.canvasProperties.canvasWidth),
            rows = Math.round(Palette.canvasProperties.canvasStyleHeight / Palette.canvasProperties.canvasHeight);
        const tileWidth = Math.round(this.canvasProperties.canvasWidth / columns),
            tileHeight = Math.round(this.canvasProperties.canvasHeight / rows);
        const currentTileX = Math.floor(x / tileWidth),
            currentTileY = Math.floor(y / tileHeight);

        const c_tile_x = currentTileX,
            c_tile_y = currentTileY;
        if (c_tile_x < 0 || c_tile_y < 0 || c_tile_x >= columns || c_tile_y >= rows) return;
        let data_color = Palette.canvasProperties.ctx.getImageData(x, y, 1, 1).data;
        if (Palette._rgbToHex(data_color[0], data_color[1], data_color[2]) != Palette._rgbToHex(oldColor[0], oldColor[1], oldColor[2])) return;
        Palette._redraw(x, y);

        this._floodFill(x - tileWidth, y, oldColor, newColor);
        this._floodFill(x + tileWidth, y, oldColor, newColor);
        this._floodFill(x, y + tileHeight, oldColor, newColor);
        this._floodFill(x, y - tileHeight, oldColor, newColor);
    },

    async _getLinkToImage() {
        const url = `https://api.unsplash.com/photos/random?query=town,${Palette.image.searchCityName}&client_id=83bbbf8e248363371ad9af5bfe88c141fbabfba8807db0ad5cffb1d341f5918a`;
        let data;
        try {
            const response = await fetch(url);
            data = await response.json();
        } catch (error) {
            console.log(error);
        }
        return data.urls.small;
    },

    async _loadImage() {
        const image = await Palette.loadImage(Palette.image.url);

        update();
        let sx = 0,
            sy = 0,
            dWidth = image.width,
            dHeight = image.height;

        Palette.canvasProperties.ctx.clearRect(0, 0, Palette.canvasProperties.canvasWidth, Palette.canvasProperties.canvasHeight);
        if (image.width < image.height) {
            dHeight = Palette.canvasProperties.canvasHeight;
            dWidth = Palette.canvasProperties.canvasHeight / image.height * image.width;
            sx = (Palette.canvasProperties.canvasWidth - dWidth) / 2;
        } else {
            dWidth = Palette.canvasProperties.canvasWidth;
            dHeight = Palette.canvasProperties.canvasWidth / image.width * image.height;
            sy = (Palette.canvasProperties.canvasHeight - dHeight) / 2;
        }
        Palette.canvasProperties.ctx.drawImage(image, sx, sy, dWidth, dHeight);

        function update() {
            requestAnimationFrame(update)
        }

        try {
            localStorage.setItem("saved-image-example", Palette.canvasProperties.canvas.toDataURL("image/png"));
        } catch (err) {
            console.log("Error: " + err);
        }
    },

    loadImage(src) {
        return new Promise((resolve, reject) => {
            try {
                const image = new Image;
                image.onload = () => resolve(image);

                image.crossOrigin = "anonymous";
                image.src = src;
            } catch (err) {
                return reject(err);
            }
        })
    }
}

window.onbeforeunload = Palette._initState();

window.addEventListener("DOMContentLoaded", function() {
    Palette._createCanvas(512, 512);
});