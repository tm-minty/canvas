 var requestAnimationFrame = (function(){
      return  window.requestAnimationFrame       || 
              window.webkitRequestAnimationFrame || 
              window.mozRequestAnimationFrame    || 
              window.oRequestAnimationFrame      || 
              window.msRequestAnimationFrame     || 
              function( callback ){
                  if( !window.rafCanceled ){
                    window.setTimeout(callback, 1000 / 60);
                  }
                  window.rafCanceled = false;
              };
})();

var cancelAnimationFrame = (function(){
    return window.cancelAnimationFrame ||
    window.webkitCancelAnimationFrame ||
    window.mozCancelAnimationFrame ||
    window.oCancelAnimationFrame ||
    window.msAnimationFrame ||
    function(){
        window.rafCanceled = true;
    };
})();

// Canvas object
function Canvas(context){
    if(context && context.getContext){
        this.DOMelement = context;
        this.context = context.getContext("2d");
        this.DOMelement.context = this.context;
        this.DOMelement.context.extended = this;
    }else{
        return false;
    };
    this.animate = new Animate(this.context);
    this.draw = new Draw(this.context);
    this.objects = [];
    

    // Event listeners
    this.handlerTypes = { 
         mousemove: 'mouseEvent'
        ,mouseout: 'mouseEvent'
        ,mouseover: 'mouseEvent'
        ,click: 'mouseEvent'
    };

    var handler =  function(e){
        var objects = e.target.context.extended.objects;
        for( var i = 0; i < objects.length; i++ ){
            if( typeof objects[i] == 'undefined' ) continue;
            var object = objects[i];
            if( typeof( object.events[e.type] ) == "function" ){
                if( typeof(e.target.context.extended.handlerTypes[e.type]) != 'undefined' &&
                    e.target.context.extended.handlerTypes[e.type] == 'mouseEvent' &&

                    e.clientX >= object.x - window.scrollX + object.alignDisplace.x && e.clientX <= object.x - window.scrollX + object.alignDisplace.x + object.width &&
                    e.clientY >= object.y - window.scrollY + object.alignDisplace.y && e.clientY <= object.y - window.scrollY + object.alignDisplace.y + object.height ){
                    object.events[e.type].call(object, e);
                };
            };
        };
    };

    for( i in this.handlerTypes ){
        if (typeof this.DOMelement.addEventListener != 'undefined')
            this.DOMelement.addEventListener(i, handler, false);
        else if (typeof this.DOMelement.attachEvent != 'undefined')
            this.DOMelement.attachEvent('on' + i, handler);
    };

    // Clear canvas function
    this.context.clear = function(){
        this.clearRect(-10, -10, this.canvas.width+10, this.canvas.height+10);
    };

    // Declare link to Canvas object in canvas context object
    this.context.extended = this;

    return this;
};

// Object animation
function Animate(context){
    this.context = context;     // Canvas context
    this.drawFuncs = [];     // Array of animation functions / private
    this.drawTime = 0;

    var stoped = false;     // Stop flag

    this.getDraws = function(){
        return this.drawFuncs;
    }

    // Draw frame function setter
    this.addDraw = function(func){
        if(typeof(this.draw) == "function" && this.drawFuncs.push){
            return this.drawFuncs.push({"func": func, "enabled": true});
        };
    };

    // Disable draw frame function
    this.disableDraw = function(i){
        if( this.drawFuncs[i] ){
            this.drawFuncs[i].enabled = false;
            return true;
        }else{
            return false;
        };
    };

    // Remove draw frame function
    this.removeDraw = function(i){
        if( typeof this.drawFuncs[i] != 'undefined' ){
            delete this.drawFuncs[i];
        };
        return this;
    };

    // Animation step
    this.draw = function(timestamp){
        this.context.clear();
        var delta = timestamp - this.drawTime;

        for( var i in this.drawFuncs ){
            if( this.drawFuncs[i].enabled ){
                this.drawFuncs[i].func(delta);
            };
        };

        for( var i in this.context.extended.objects ){
            var obj = this.context.extended.objects[i];
            if( typeof obj != 'undefined' ){
                obj.render(delta);
            }
        }

        this.drawTime = timestamp;
    };

    this.step = function(timestamp){
        if( !stoped ){
            var self = this;
            requestAnimationFrame(function(timestamp){ self.step(timestamp); });
            this.draw(timestamp);
        }
    };

    // Stop animation function
    this.stop = function(){
        stoped = true;
    };

    // Toggle play function
    this.togglePlay = function(){
        stoped = !stoped;
        this.step(1);
    };

    // Start animation function
    this.play = function(){
        stoped = false;
        this.step(1);
    };

    return this;
};

// Draw object
function Draw(context){
    this.context = context; // Canvas context

    // Drawing rectangle function
    this.Rectangle = function(x, y, width, height, fill, stroke, strokeWidth){
        var shape = new Shape(context, x, y, width, height, fill, stroke, strokeWidth);
        shape.setDraw(function(){
            context.fillStyle = this.fill;
            context.fillRect(this.alignDisplace.x, this.alignDisplace.y, this.width, this.height);
            context.strokeStyle = this.stroke;
            context.lineWidth = this.strokeWidth;
            if( this.stroke && this.strokeWidth ){
                context.strokeRect(this.x, this.y, this.width, this.height);
            };
        });
        context.extended.objects.push(shape);
        shape.index = context.extended.objects.length - 1;
        return shape;
    };
    this.Image = function(src, x, y, width, height){
        //width = width || 1;
        //height = height || 1;
        var shape = new Shape(context, x, y, width, height);
        var image = new Image();
        image.src = src;
        shape.setDraw((function(img){
            return function(){
                context.drawImage(img, this.alignDisplace.x, this.alignDisplace.y);
            };
        })(image));
        context.extended.objects.push(shape);
        shape.index = context.extended.objects.length - 1;
        return shape;
    };


    return this;
};

// Universal shape object
function Shape(context, x, y, width, height, fill, stroke, strokeWidth){
    this.context = context;
    this.x = x;
    this.y = y;
    this.alignDisplace = {
        x: 0,
        y: 0
    };
    this.width = width;
    this.height = height;
    this.fill = fill;
    this.stroke = stroke;
    this.strokeWidth = strokeWidth;
    this.rotation = 0;
    this.scaleValues = {
        x: 1,
        y: 1
    };
    this.drawFuncs = [];
    this.events = {};
    this.createTime = Date.now();

    // Draw shape function
    this.draw = function(){};

    // Draw function wrapper
    this.render = function(){
        this.context.save();
        this.context.translate(this.x, this.y);
        this.context.scale(this.scaleValues.x, this.scaleValues.y);
        this.context.rotate( this.rotation * (Math.PI/180) );
        this.draw();
        context.restore();
    };
    
    // Draw shape function setter
    this.setDraw = function(func){
        if(typeof(this.draw) == "function"){
            this.draw = function(){ func.call(this, arguments); return this; };
            this.drawFuncs.push((function(self){return function(){self.render();}})(this));
        };
        return this;
    };

    // Add event listener
    this.bind = function( type, func ){
        this.events[type] = func;
        return this;
    };

    // Disable draws
    this.disable = function(){
        for( var i = this.drawFuncs.length; i--; ){
            this.context.extended.animate.disableDraw( this.drawFuncs[i] );
        };
    }

    // Remove shape
    this.remove = function(){
        for( var i = this.drawFuncs.length; i--; ){
            this.context.extended.animate.removeDraw( this.drawFuncs[i] );
        };
        this.context.extended.objects.splice(this.context.extended.objects.indexOf(this), 1);
        return true;
    };

    // Change alignment
    this.align = function(a){
        if( typeof a == "string"){
            if( a == "center" ){
                this.alignDisplace.x = this.width/2 * -1;
                this.alignDisplace.y = this.height/2 * -1;
            }else if( a == "left" ){
                this.alignDisplace.x = 0;
                this.alignDisplace.y = 0
            }else if( a == "right" ){
                this.alignDisplace.x = this.width * -1;
                this.alignDisplace.y = 0;
            }
        }else if( typeof a == "object" && a.length && a.length == 2 ){
            this.alignDisplace.x = this.width/100*a[0] * -1;
            this.alignDisplace.y = this.height/100*a[1] * -1;
        }else if( typeof a == "function" ){
            a.apply(this);
        };
        return this;
    };

    // Set rotation // in degrees
    this.setRotation = function(d){
        this.rotation = d;
        return this;
    }

    // Rotate // in degrees
    this.rotate = function(d){
        this.rotation += d;
        return this;
    }

    // Set scale
    this.setScale = function(x, y){
        this.scaleValues.x = x || this.scaleValues.x;
        this.scaleValues.y = y || this.scaleValues.y;
        return this;
    }

    // Scale
    this.scale = function(x, y){
        this.scaleValues.x = this.scaleValues.x + x || this.scaleValues.x;
        this.scaleValues.y = this.scaleValues.y + y || this.scaleValues.y;
        return this;
    }

    // Set position
    this.setPosition = function(x, y){
        this.x = x || this.x;
        this.y = y || this.y;

        return this;
    }

    // Move
    this.move = function(x, y){
        var x = x || 0;
        var y = y || 0;

        this.x = this.x + x;
        this.y = this.y + y;

        return this;
    }

    return this;
};

// Point
function Point(x, y){
    this.x = x;
    this.y = y;

    // Set position
    this.setPosition = function(x, y){
        this.x = x || this.x;
        this.y = y || this.y;

        return this;
    }

    return this;
}
