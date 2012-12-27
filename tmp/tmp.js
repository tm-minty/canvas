            
        var CONST = {
            M: 10,
            G: 9.8
        };
        var objectsCountContainer;
        var indexContainer;
        var dotSrc = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6MTI3RkIyRkZDNkExMTFFMTg2MkZCMkFDMDE0MDdFNEQiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6MTI3RkIzMDBDNkExMTFFMTg2MkZCMkFDMDE0MDdFNEQiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDoxMjdGQjJGREM2QTExMUUxODYyRkIyQUMwMTQwN0U0RCIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDoxMjdGQjJGRUM2QTExMUUxODYyRkIyQUMwMTQwN0U0RCIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/Puok3LIAAABFSURBVHjaYlRSUuJjYGBQBGJ5IH4IxPdZoALmQGwExOeAmIEFqsIYiO2BmBGIX7BAtZwF4v9QlQ9BgvcZIOAFzEyAAAMAJwkNO100t/8AAAAASUVORK5CYII=';



        var MT = {
             speed: 300 // 10 pixels per second
        }, rect;

            // movement test
            for(var i = 5000; i--; ){
                rect = new demo.draw.Rectangle(
                        canvas.width/2 + 200 * Math.sin(i), canvas.height/2 + 200 * Math.cos(i),  // Position
                        5, 5,  // Size
                        "rgba(" + getRandomInt(0, 255) + ", " + getRandomInt(0, 255) + ", " + getRandomInt(0, 255) + ", .1)" // Color
                    ).draw();
                rect.R = 200;
                rect.direction = 1;
            }

            demo.context.font = "20px Arial";


            demo.animate.addDraw(function(delta){
                var delta = delta/1000;
                for(var i in demo.objects){
                    var rect = demo.objects[i],
                        speed = 5;

                    if(rect.direction > 0){
                        rect.R += speed;
                        if( rect.R > 300 ){
                            rect.direction = -1;
                        }
                    }else{
                        rect.R -= speed;
                        if( rect.R < 100 ){
                            rect.direction = 1;
                        }
                    }

                    rect.fill = "rgba(" + getRandomInt(0, 255) + ", " + getRandomInt(0, 255) + ", " + getRandomInt(0, 255) + ", .1)";

                    rect.x = canvas.width/2 + rect.R * Math.sin(i);
                    rect.y = canvas.height/2 + rect.R * Math.cos(i);

                    // var x = {}, y = {};
                    
                    // x.S = _mouse.x - rect.x;
                    // if( _mouse.x > rect.x && x.S < 0 || _mouse.x < rect.x && x.S > 0 ){
                    //     x.S = 0;
                    //     console.log("xS: 0");
                    // }

                    // x.duration = Math.abs(x.S/MT.speed);
                    // x.progress = delta / x.duration;
                    // x.res = x.S * x.progress;

                    // y.S = _mouse.y - rect.y;
                    // y.duration = Math.abs(y.S/MT.speed);
                    // y.progress = delta / y.duration;
                    // y.res = y.S * y.progress;

                    // if( rect.x == _mouse.x || _mouse.x > rect.x && rect.x + x.res > _mouse.x || _mouse.x < rect.x && rect.x + x.res < _mouse.x ){
                    //     rect.x = _mouse.x;
                    // }else{
                    //     rect.x += x.res;
                    // }
                    // if( rect.y == _mouse.y || _mouse.y > rect.y && rect.y + y.res > _mouse.y || _mouse.y < rect.y && rect.y + y.res < _mouse.y ){
                    //     rect.y = _mouse.y;
                    // }else{
                    //     rect.y += y.res;
                    // }
                }
                demo.context.fillStyle = "#000";
                demo.context.fillText(Math.round(1/delta), 50, 50);
            });

            // demo.animate.addDraw(function(delta){
            //     for( var i = demo.objects.length; i--; ){
            //         if( typeof demo.objects[i] == 'undefined' ) continue;
            //         var obj = demo.objects[i];
            //         if( obj.x <= 0 || obj.x >= canvas.width || obj.y <= 0 || obj.y >= canvas.height || obj.life == obj.lifetime ){
            //             obj.remove();
            //             continue;
            //         };
            //         obj.x += Math.sin(5) * obj.rndx;
            //         obj.y += Math.sin(5) * obj.rndy + obj.gravity;
            //         obj.gravity += .4;
            //         obj.life++;
            //     };
            //     var size = getRandomInt(1, 25);
            //     for(var ic = 1; ic--;){
            //         var dot = new demo.draw
            //                     .Image(dotSrc, _mouse.x, _mouse.y, size, size)
            //                     .draw();
            //         dot.rndy = getRandomInt(-3, 3);
            //         dot.rndx = getRandomInt(-3, 3);
            //         dot.weight = getRandomInt(3,7);
            //         dot.gravity = .4;
            //         dot.lifetime = 30;
            //         dot.life = 0;
            //     }
            //     _cursor = _mouse;
            // });

            // rect = [];
            // for(var i = 0; i < 2000; i++ ){
            //     var color = getRandomInt(0, 255);
            //     rect[i] = new demo.draw.Rectangle(canvas.width/2 + getRandomInt(-20, 20), canvas.height/2 + getRandomInt(-20, 20), 3, 3, "rgba(" + color + ", " + color + ", " + color + ", 1)").draw().bind('click', function(){ console.log('blea'); });
            //     demo.animate.addDraw((function(rect, rects){ return function(){
            //         if( typeof(rect.lifetime) == 'undefined' ){
            //             rect.lifetime = 0;
            //         }
            //         rect.lifetime++;
            //         if( rect.lifetime % 30 == 0 ){
            //             var i = rects.length
            //             //rects[i] = new demo.draw.Rectangle( rect.x, rect.y, rect.width, rect.height, rect.fill);
            //         }
            //         rect.x += getRandomInt(-2, 2);
            //         rect.y += getRandomInt(-2, 2);
            //         rect.draw();
            //     }})(rect[i], rect));
            // };
            
             // event bind test
            // var rect = new demo.draw.Rectangle(
            //         canvas.width/2 - 40, canvas.height/2 - 40, // position: center
            //         80, 80, // size
            //         "rgba(" + getRandomInt(0, 255) + ", " + getRandomInt(0, 255) + ", " + getRandomInt(0, 255) + ", 1)" // color

            //         ).draw().bind('click', function(){ console.log('blea'); });
            