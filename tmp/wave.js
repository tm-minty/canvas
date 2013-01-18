var getCell = function(map, x, y){
                if( y >= 0 && y < map.length && x >= 0 && x < map[0].length ){
                    return map[y][x];
                }
                return false;
            }

            var goWater = function(map, x, y){
                var cell;
                if( cell = getCell(map, x, y) ){
                    var tCell;
                    if( tCell = getCell(map, x, y + 1) ){ // Top
                        if(tCell.free){
                            tCell.hasWater = true;
                            tCell.waterFrom = new Point(x, y);
                        }
                    }

                    if( tCell = getCell(map, x, y - 1) ){ // Bottom
                        if(tCell.free){
                            tCell.hasWater = true;
                            tCell.waterFrom = new Point(x, y);
                        }
                    }

                    if( tCell = getCell(map, x - 1, y) ){ // Left
                        if(tCell.free){
                            tCell.hasWater = true;
                            tCell.waterFrom = new Point(x, y);
                        }
                    }

                    if( tCell = getCell(map, x + 1, y) ){ // Top
                        if(tCell.free){
                            tCell.hasWater = true;
                            tCell.waterFrom = new Point(x, y);
                        }
                    }
                }
                return false;
            }

            var findWay = function(map, start, end){
                map[end[1]][end[0]].hasWater = true;
                var counter = 0;

                while( counter < 150 ){
                    for( var y = 0, yl = map.length; y < yl; y++ ){
                        for( var x = 0, xl = map[y].length; x < xl; x++ ){
                            if( map[y][x].hasWater ){
                                goWater(map, x, y);
                            }
                        }
                    }

                    if( map[start[1]][start[0]].hasWater ){
                        return true;
                    }

                    counter++;
                }

                return [];
            }

            var getWay = function(map, start, end){
                if( findWay(map, start, end) ){
                    var way = [],
                        p1 = new Point(start[0], start[1]),
                        end = new Point(end[0], end[1]),
                        p2 = new Point(0,0),
                        c = 0;

                    while(c < 50){
                        p2.x = map[p1.y][p1.x].waterFrom.x;
                        p2.y = map[p1.y][p1.x].waterFrom.y;

                        way.push(new Point(p2.x, p2.y));

                        p1 = p2;

                        if( p1.x == end.x && p1.y == end.y ){
                            break;
                        }

                        c++;
                    }

                    return way;
                }
                return false;
            }

            var w = getWay(map, [5, 3], [7, 7]);
            for(var i = w.length; i--; ){
                if(map[w[i].y][w[i].x].free){
                    map[w[i].y][w[i].x].v.fill = map[w[i].y][w[i].x].v.pathFill;
                }else{
                    map[w[i].y][w[i].x].v.fill = "#0FF";
                }
            }