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

                    e.clientX >= object.x && e.clientX <= object.x + object.width &&
                    e.clientY >= object.y && e.clientY <= object.y + object.height ){
                    object.events[e.type]();
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
        return drawFuncs;
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
    this.draw = function(){
        this.context.clear();

        var currentTime = (new Date() - 0),
            delta = currentTime - this.drawTime;
        
        for( var i in this.drawFuncs ){
            if( this.drawFuncs[i].enabled ){
                this.drawFuncs[i].func(delta);
            };
        };

        this.drawTime = (new Date() - 0);
    };

    this.step = function(){
        if( !stoped ){
            var self = this;
            requestAnimationFrame(function(){ self.step(); });
            this.draw();
        }
    };

    // Stop animation function
    this.stop = function(){
        stoped = true;
    };

    // Toggle play function
    this.togglePlay = function(){
        stoped = !stoped;
        if( this.drawTime == 0 && !stoped ){
            this.drawTime = (new Date() - 0);
        }
        this.step();
    };

    // Start animation function
    this.play = function(){
        if( this.drawTime == 0 ){
            this.drawTime = (new Date() - 0);
        }
        if(typeof(this.draw) == "function"){
            this.draw();
        };

        stoped = false;

        this.step();
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
            context.fillRect(this.x, this.y, this.width, this.height);
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
                context.drawImage(img, this.x, this.y);
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
    this.width = width;
    this.height = height;
    this.fill = fill;
    this.stroke = stroke;
    this.strokeWidth = strokeWidth;
    this.drawFuncs = [];
    this.events = {};
    this.index = 0;
    this.createTime = (new Date() - 0);

    // Draw shape function
    this.draw = function(){};
    
    // Draw shape function setter
    this.setDraw = function(func){
        if(typeof(this.draw) == "function"){
            this.draw = function(){ func.call(this, arguments); return this; };
            this.drawFuncs.push(this.context.extended.animate.addDraw((function(self){return function(){self.draw();}})(this)));
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
        delete this.context.extended.objects[this.index];
        return true;
    };

    return this;
};

// Point
function Point(x, y){
    this.x = x;
    this.y = y;

    return this;
}
