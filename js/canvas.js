// Canvas object
function Canvas(context, fps){
    if(context && context.getContext){
        this.context = context.getContext("2d");
    }else{
        return false;
    };
    if( fps ){
        this.fps = fps;
    }else{
        this.fps = 30;
    };
    this.animate = new Animate(this.context, this.fps);
    this.draw = new Draw(this.context);
    this.objects = [];
    
    // Clear canvas function
    this.context.clear = function(){
        this.clearRect(0, 0, this.canvas.width, this.canvas.height);
    };

    // Declare link to Canvas object in canvas context object
    this.context.extended = this;
};

// Animation object
function Animate(context, fps){
    this.context = context; // Canvas context
    this.fps = fps; // Animation FPS
    this.currentFPS = 0; // Animation FPS counter current value 
    this.showFPS = false;

    var interval; // Animation interval / private
    var fpsCount = 0; // Animation FPS counter / private
    var fpsCounter; // Animation FPS counter interval / private
    var drawFuncs = []; // Array of animation functions / private

    // Draw frame function
    this.draw = function(){};

    // Draw frame function setter
    this.addDraw = function(func){
        if(typeof(this.draw) == "function" && drawFuncs.push){
            return drawFuncs.push({"func": func, "enabled": true});
        }else{
            console.log('NINE!!!');
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
        if( this.drawFuncs[i] ){
            delete this.drawFuncs[i];
        };
    };

    // Animation step
    this.step = function(){
        this.context.clear();
        for( i in drawFuncs ){
            if( drawFuncs[i].enabled ){
                drawFuncs[i].func();
            };
        };
        this.fpsCount++;
    };

    // Stop animation function
    this.stop = function(){
        clearInterval(this.interval);
    };

    // Start animation function
    this.play = function(){
        if(typeof(this.draw) == "function"){
            this.draw();
        };
        this.fpsCounter = setInterval((function(self){return function(){ self.countFPS(); }})(this), 1000)
        this.interval = setInterval((function(self){ return function(){ self.step(); }})(this), 1000 / this.fps);
    };

    // Count FPS function
    this.countFPS = function(){
        this.currentFPS = this.fpsCount;
        this.fpsCount = 0;
        if( this.showFPS ){ console.log(this.currentFPS); };
    };
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
            context.strokeRect(this.x, this.y, this.width, this.height);
        });
        context.extended.objects.push(shape);
        return shape;
    };
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

    // Draw shape function
    this.draw = function(){};
    
    // Draw shape function setter
    this.setDraw = function(func){
        if(typeof(this.draw) == "function"){
            this.draw = func;
            this.drawFuncs.push(context.extended.animate.addDraw((function(self){return function(){self.draw();}})(this)));
        };
    };
};
