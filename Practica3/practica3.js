var game = function() {
    
    var Q = Quintus({development: true}).include("Scenes, Sprites, Input, UI, Touch, TMX, Anim, 2D").setup({
        width: 320,
        height: 480,
        maximize: true
    }).controls().touch();
  

    Q.scene("level1",function(stage) {
        Q.stageTMX("level.tmx",stage);
	 	var mario = stage.insert(new Q.Mario({ x: 150, y: 380 }));
        stage.add("viewport").follow(mario,{ x: true, y: false });
        stage.centerOn(150,380);
        stage.viewport.offsetX=-125;
    });
    Q.loadTMX("level.tmx", function() {
        Q.stageScene("level1");
    });


    Q.load(["mario_small.png", "mario_small.json"], function() {
        Q.compileSheets("mario_small.png", "mario_small.json");
    });

    Q.Sprite.extend("Mario", {
        init: function(p){
            this._super(p, {
                sheet: "marioR",
                x: 150,
                y: 380,
                inix: 150,
                iniy: 380
            });
            this.add('2d, platformerControls');
        },
        step: function(dt) {
            if(this.p.y > 700) {
                this.p.x=this.p.inix
                this.p.y=this.p.iniy;
                console.log("manco");
            }

        }        
    });

 

};