var Key = function(){
    var self = this,
        bind = function(obj, event, handler){
            if (typeof obj.addEventListener != 'undefined')
                obj.addEventListener(event, handler, false);
            else if (typeof obj.attachEvent != 'undefined')
                obj.attachEvent('on' + event, handler);
            return obj;
        },
        _keycode_dictionary = {
            0: "\\", "\\": 0, 
            8: "backspace", "backspace": 8, 
            9: "tab", "tab": 9, 
            12: "num", "num": 12, 
            13: "enter", "enter": 13, 
            16: "shift", "shift": 16, 
            17: "ctrl", "ctrl": 17, 
            18: "alt", "alt": 18, 
            19: "pause", "pause": 19, 
            20: "caps", "caps": 20, 
            27: "escape", "escape": 27, 
            32: "space", "space": 32, 
            33: "pageup", "pageup": 33, 
            34: "pagedown", "pagedown": 34, 
            35: "end", "end": 35, 
            36: "home", "home": 36, 
            37: "left", "left": 37, 
            38: "up", "up": 38, 
            39: "right", "right": 39, 
            40: "down", "down": 40, 
            44: "print", "print": 44, 
            45: "insert", "insert": 45, 
            46: "delete", "delete": 46, 
            48: "0", "0": 48, 
            49: "1", "1": 49, 
            50: "2", "2": 50, 
            51: "3", "3": 51, 
            52: "4", "4": 52, 
            53: "5", "5": 53, 
            54: "6", "6": 54, 
            55: "7", "7": 55, 
            56: "8", "8": 56, 
            57: "9", "9": 57, 
            65: "a", "a": 65, 
            66: "b", "b": 66, 
            67: "c", "c": 67, 
            68: "d", "d": 68, 
            69: "e", "e": 69, 
            70: "f", "f": 70, 
            71: "g", "g": 71, 
            72: "h", "h": 72, 
            73: "i", "i": 73, 
            74: "j", "j": 74, 
            75: "k", "k": 75, 
            76: "l", "l": 76, 
            77: "m", "m": 77, 
            78: "n", "n": 78, 
            79: "o", "o": 79, 
            80: "p", "p": 80, 
            81: "q", "q": 81, 
            82: "r", "r": 82, 
            83: "s", "s": 83, 
            84: "t", "t": 84, 
            85: "u", "u": 85, 
            86: "v", "v": 86, 
            87: "w", "w": 87, 
            88: "x", "x": 88, 
            89: "y", "y": 89, 
            90: "z", "z": 90, 
            91: "cmd", "cmd": 91, 
            92: "cmd", "cmd": 92, 
            93: "cmd", "cmd": 93, 
            96: "num_0", "num_0": 96, 
            97: "num_1", "num_1": 97, 
            98: "num_2", "num_2": 98, 
            99: "num_3", "num_3": 99, 
            100: "num_4", "num_4": 100, 
            101: "num_5", "num_5": 101, 
            102: "num_6", "num_6": 102, 
            103: "num_7", "num_7": 103, 
            104: "num_8", "num_8": 104, 
            105: "num_9", "num_9": 105, 
            106: "num_multiply", "num_multiply": 106, 
            107: "num_add", "num_add": 107, 
            108: "num_enter", "num_enter": 108, 
            109: "num_subtract", "num_subtract": 109, 
            110: "num_decimal", "num_decimal": 110, 
            111: "num_divide", "num_divide": 111, 
            124: "print", "print": 124, 
            144: "num", "num": 144, 
            145: "scroll", "scroll": 145, 
            186: ";", ";": 186, 
            187: "=", "=": 187, 
            188: ",", ",": 188, 
            189: "-", "-": 189, 
            190: ".", ".": 190, 
            191: "/", "/": 191, 
            192: "`", "`": 192, 
            219: "[", "[": 219, 
            220: "\\", "\\": 220, 
            221: "]", "]": 221, 
            222: "\'", "\'": 222, 
            224: "cmd", "cmd": 224, 
            57392: "ctrl", "ctrl": 57392, 
            63289: "num", "num": 63289, 
        },
        actions = {
            keydown: function(e){
                self.down = true;
                if( self.activeKeys.indexOf(e.keyCode) < 0 ){
                    self.activeKeys.push(e.keyCode)
                }
            },
            keyup: function(e){
                var keyIndex = self.activeKeys.indexOf(e.keyCode);
                if( keyIndex >= 0 ){
                    self.activeKeys.splice(keyIndex);
                }

                if( self.activeKeys.length == 0 ){
                    self.down = false;
                }
            }
        }

    this.activeKeys = [];
    this.down = false;
    this.is = function(c){
        if( typeof c == "string" ){
            return this.activeKeys.indexOf(_keycode_dictionary[c]) > -1;
        }
        return this.activeKeys.indexOf(c) > -1;
    }

    bind(document.body, 'keydown', actions.keydown);
    bind(document.body, 'keyup', actions.keyup);
}

