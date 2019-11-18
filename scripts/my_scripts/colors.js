const ColorsPalette = {
    colors: {
        currentColor: '#757575',
        prevColor: '#757575',
        firstColor: '#F74141',
        secondColor: '#41B6F7'
    },

    _styleColors() {
        document.querySelector('#current_color').style.background = ColorsPalette.colors.currentColor;
        document.querySelector('#prev_color').style.background = ColorsPalette.colors.prevColor;
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

    _hexToRGBarr(hex) {
        const hex_code = hex.replace("#", "");
        let rgb = [];

        let r = parseInt(hex_code.slice(0, 2), 16),
            g = parseInt(hex_code.slice(2, 4), 16),
            b = parseInt(hex_code.slice(4, 6), 16);

        rgb.push(r);
        rgb.push(g);
        rgb.push(b);
        return rgb;
    }
}