var game = function() {
    
    var Q = Quintus({audioSupported: [ "mp3","ogg" ] }).include("Scenes, Sprites, Input, UI, Touch, TMX, Anim, 2D, Anim, Audio").setup({
        width: 320,
        height: 480,
        maximize: true
    }).controls().touch();
   
    Q.audio.enableHTML5Sound();

    Q.animations("mario", {
        run_right: { frames: [1,2,3], rate: 1/6, loop:false, next: "stand_right" }, 
		run_left: { frames: [15,16,17], rate:1/6, loop:false, next: "stand_left" },
		stand_right: { frames: [0] },
		stand_left: { frames: [14] },
		jump_right: { frames: [4], loop: false, rate:1, next: "stand_right" },
		jump_left: { frames: [18], loop: false, rate:1, next: "stand_left" },
		dieM: { frames: [12], rate:1, loop: false, trigger: "deadM"}
    });

    Q.animations("goombaRed", {
        move: { frames: [0, 1], rate: 1/3, loop:true},
        dieE: { frames: [2], loop:false, trigger: "deadG" }
    });

    Q.animations("goombaBlue", {
        move: { frames: [4, 5], rate: 1/3, loop:true},
        dieE: { frames: [6], loop:false, trigger: "deadG" }
    });

    Q.animations("goombaWhite", {
        move: { frames: [8, 9], rate: 1/3, loop:true},
        dieE: { frames: [10], loop:false, trigger: "deadG" }
    });
   
    Q.animations("coin", {
        rotate: { frames: [0, 1, 2], rate: 1/6, loop:true}
    });

    Q.animations("block", {
        rotate: { frames: [23, 30, 37], rate: 1/6, loop:true}
    });

    Q.animations("bloopa", {
        move: { frames: [0, 1], rate: 1/2, loop:true},
        dieE: { frames: [2], loop:false, trigger: "deadB"}
    });


/* -+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
                                            LEVEL 1
   -+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+*/
    Q.scene("level1",function(stage) {
        Q.audio.stop();
        Q.audio.play("music_main.mp3",{ loop: true });
        Q.stageTMX("level.tmx",stage);
        var mario = stage.insert(new Q.Mario({ x: 150, y: 380 }));
        var goomba1 = stage.insert(new Q.Goomba({ x: 350, y: 500, velocidad: -80, sprite: "goombaRed"}));
        var goomba2 = stage.insert(new Q.Goomba({ x: 550, y: 500, sprite: "goombaBlue"}));
        var goomba3 = stage.insert(new Q.Goomba({ x: 1500, y: 500, sprite: "goombaWhite"}));
        var bloopa = stage.insert(new Q.Bloopa({ x: 220, y: 450 }));
        var princess = stage.insert(new Q.Princess({ x: 2000, y: 450 }));
        var coin1 = stage.insert(new Q.Coin({ x: 700, y: 420 }));
        var coin2 = stage.insert(new Q.Coin({ x: 730, y: 420 }));
        var coin3 = stage.insert(new Q.Coin({ x: 760, y: 420 }));
        var bloque1 = stage.insert(new Q.Block({ x: 1410, y: 380}));
        var seta = stage.insert(new Q.Mushroom1up({ x: 1410, y: 360}));
        //Tuberia:
        var piperIz = stage.insert(new Q.PiperLeftUp({ x: 585, y: 480 }));
        var piperDr = stage.insert(new Q.PiperRightUp({ x: 600, y: 480 }));
        var piperIzBase = stage.insert(new Q.PiperLeftDown({ x: 585, y: 500 }));
        var piperDrBase = stage.insert(new Q.PiperRightDown({ x: 600, y: 500 }));

        stage.add("viewport").follow(mario,{ x: true, y: false });
        stage.centerOn(150,380);
        stage.viewport.offsetX=-125;

    });
   

    Q.scene('startGame',function(stage) {
		var play = stage.insert(new Q.UI.Button({
	      asset: 'mainTitle.png',
	      x: Q.width/2,
	      y: Q.height/2,
	    }, function() {
	    }));

	    play.on("click", function() {
            Q.clearStages();
            Q.state.set("score",0);
            Q.state.set("lifes",3); 
            Q.stageScene('level1');
            Q.stageScene("HUD", 2);
	    });
	});

    Q.scene('endGame',function(stage) {
        var container = stage.insert(new Q.UI.Container({
          x: Q.width/2, y: Q.height/2, fill: "rgba(0,0,0,0.5)"
        }));
      
        var button = container.insert(new Q.UI.Button({ x: 0, y: 0, fill: "#CCCCCC",
                                                        label: "Play Again" }))         
        var label = container.insert(new Q.UI.Text({x:10, y: -10 - button.p.h, 
                                                         label: stage.options.label }));
        button.on("click",function() {
          Q.clearStages();
          Q.stageScene('startGame');
        });
      
        container.fit(20);
      });

/* -+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
                                                 HUD
   -+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+*/
    Q.scene("HUD",function(stage) {

		Q.UI.Text.extend("Monedas",{ 
	        init: function(p) {
	            this._super({
	                label: "Monedas: 0",
	                color: "yellow",
	                x: Q.width * 0.25 + 20,
	                y: 5
	            });
	        },
            
            step: function (dt) {
                this.p.label = "Monedas: " + Q.state.get("score");
            }
        });
        
        Q.UI.Text.extend("Vidas",{ 
	        init: function(p) {
	            this._super({
	                label: "Vidas: 0",
	                color: "white",
	                x: Q.width * 0.25 - 2,
	                y: 30
	            });
	        },
            
            step: function (dt) {
                this.p.label = "Vidas: " + Q.state.get("lifes");
            }
		});

	    var container = stage.insert(new Q.UI.Container({
	        x: 0, y: 0, fill: "rgba(0,0,0,1)"
	    }));

        container.insert(new Q.Monedas());
        container.insert(new Q.Vidas());
	});


/* -+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
                                             MARIO
   -+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+*/
    Q.Sprite.extend("Mario", {
        init: function(p){
            this._super(p, {
                sheet: "marioR",
                sprite: "mario",
                frame: 0,
                x: 150,
                y: 380,
                inix: 150,
                iniy: 380,
                gravity: 0.5
            });
            this.add('2d, platformerControls, animation');
            //this.on("deadM", this, "die");
            this.on("killMario", "die");
            this.on("bump.bottom",function(collision) {
                if(collision.obj.isA("Goomba")) {
                    collision.obj.die();
                    this.p.vy = -200;

                }
                else if (collision.obj.isA("Bloopa")) {
                    collision.obj.p.gravity = 1;
                    collision.obj.die();
                    this.p.vy = -300;
                }
                
            });
            
            
            this.on("bump.bottom, bump.left, bump.right, bump.top",function(collision) {
            if (collision.obj.isA("Princess")) {
                Q.audio.stop();
                Q.audio.play("music_level_complete.mp3");   
                Q.stageScene("endGame", 1, {label: "You Won!"}); 
                this.destroy();
            }
            else if (collision.obj.isA("Coin")) {
                Q.audio.play("coin.mp3");
                collision.obj.raise();
            }
            });

           
        },
        step: function(dt) {
            if(this.p.vy < 0){ //Está saltando
                if(this.p.vx > 0) {
                    this.play("jump_right");
                } else if(this.p.vx < 0) {
                    this.play("jump_left");
                }
            }
            else {
                if(this.p.vx > 0) {
                    this.play("run_right");
                } else if(this.p.vx < 0) {
                    this.play("run_left");
                } else {
                    this.play("stand_" + this.p.direction);
                }    
            }
            if(this.p.y > 700) {
               this.die();
            }
        }, 

        die: function() {

            if (Q.state.get("lifes") === 1) {
                Q.state.dec("lifes", 1);
                this.del("platformerControls");
                Q.audio.stop();
                Q.audio.play("music_die.mp3"); 
                Q.stageScene("endGame", 1, {label: "You Died!"});
                this.destroy();
            }
            else {
                Q.state.dec("lifes", 1);
                /*this.p.x=this.p.inix;
                this.p.y=this.p.iniy;*/
               // Q.clearStages();
                Q.stageScene("level1");
            }
            
        }
    });

/* -+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
                                               GOOMBA
   -+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+*/
    Q.Sprite.extend("Goomba", {
        init: function(p){
            this._super(p, {
                sheet: "goomba",
                x: 200,
                y: 300,
                inix: 300,
                iniy: 380,
                velocidad: 80,
                
            });
           
            this.on("deadG", "die");
            this.add('2d, aiBounce, animation, defaultEnemy');
            this.on("bump.left,bump.right", function(collision) {
                if(!collision.obj.isA("Mario")) {
                 this.p.velocidad = -1 * this.p.velocidad;
                }
            });
            
            this.play("move");
        },
        step: function (dt) {
            this.p.x += this.p.velocidad*dt;
        }, 
     
    });
 
/* -+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
                                               BLOOPA
   -+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+*/
    Q.Sprite.extend("Bloopa", {
        init: function(p){
            this._super(p, {
                sheet: "bloopa",
                sprite: "bloopa",
                frame: 0,
                x: 200,
                y: 300,
                inix: 300,
                iniy: 380,
                gravity: 0.3,
                vy: 2,
            });

            this.on("deadB", "die");

            this.add('2d, animation, defaultEnemy');
            this.play("move");

            this.on("bump.bottom", function(collision) {
                if(!collision.obj.isA("Mario")) {
                    this.p.velocidad = -1 * this.p.velocidad;
                    this.p.vy = -300
                }
            });
        },          
    });



/* -+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
                                               PRINCESS
   -+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+*/
    Q.Sprite.extend("Princess", {
		init: function(p) {
			this._super(p, {
				asset: "princess.png",
			})					 
        },        
    });


/* -+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
                                                COIN
   -+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+*/
    Q.Sprite.extend("Coin", {
        init: function(p){
            this._super(p, {
                sheet: "coin",
                sprite: "coin",
                frame: 0,
                gravity: 0
            });

            this.add('2d, animation, tween');
       
            this.play("rotate");
        },    
    
        raise: function() {
            this.chain( {x: this.p.x, y: this.p.y-50}, .3, Q.Easing.Quadratic.Out, {delay: 0, callback: this.dissapear});
        },

        dissapear: function() {
            Q.state.inc("score",1);
            this.destroy();
        }
    });

/* -+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
                                                BLOCK
   -+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+*/
   Q.Sprite.extend("Block", {
    init: function(p){
        this._super(p, {
            sheet: "tiles",
            sprite: "block",
            frame: 0,
            gravity: 0
        });

        this.on("bump.bottom", function(collision) {
            if(collision.obj.isA("Mario")) {
                this.chain( {x: this.p.x, y: this.p.y-15}, .3, Q.Easing.Quadratic.Out, {delay: 0});
                this.chain( {x: this.p.x, y: this.p.y}, .3, Q.Easing.Quadratic.Out, {delay: 0});
                Q.audio.play("item_rise.mp3");
                var seta = Q.insert(new Q.Mushroom1up({ x: 1410, y: 360}));
            }
        });

        this.add('2d, animation, tween');
   
        this.play("rotate");
    },    

    dissapear: function() {
        Q.state.inc("score",1);
        this.destroy();
    }
});


/* -+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
                                            DEFAULT ENEMY
   -+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+*/
    Q.component("defaultEnemy", {
        added: function() {
            this.entity.on("bump.left,bump.right,bump.bottom",function(collision) {
				if(collision.obj.isA("Mario")) {
					collision.obj.trigger("killMario");
				}
            });   
        },

        extend: {
            die: function() {
                Q.audio.play("kill_enemy.mp3");
                this.destroy();
            },
        }

    });

    /* -+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
                                               1UP MUSHROOM
   -+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+*/
   Q.Sprite.extend("Mushroom1up", {
    init: function(p){
        this._super(p, {
            asset: "1up_mushroom.gif",
            velocidad: 80,
            x: 1410,
            y: 360
            
        });
       
        this.add('2d, aiBounce, animation');
        this.on("bump.left,bump.right,bump.bottom,bump.top", function(collision) {
            if(collision.obj.isA("Mario")) {
                Q.audio.play("1up.mp3");
                Q.state.inc("lifes", 1);
                this.destroy();
            }
        });
        this.on("bump.left,bump.right", function(collision) {
            if(!collision.obj.isA("Mario")) {
                this.p.velocidad = -1 * this.p.velocidad;
            }
        });
    },
    step: function (dt) {
        this.p.x += this.p.velocidad*dt;
    },  
});

/* -+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
                                                    PIPERLEFTUP
       -+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+*/

       Q.Sprite.extend("PiperLeftUp", {
        init: function(p) {
            this._super(p, {
                sheet: "tiles",
                sprite: "piper",
                frame: 3
            });

            this.add('2d');
        },
    });

    /* -+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
                                                       PIPERRIGHTUP  
          -+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+*/

    Q.Sprite.extend("PiperRightUp", {
        init: function(p) {
            this._super(p, {
                sheet: "tiles",
                sprite: "piper",
                frame: 17
            });

            this.add('2d');
        },
    });


    /* -+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
                                                    PIPERLEFTFDOWN
       -+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+*/

    Q.Sprite.extend("PiperLeftDown", {
        init: function(p) {
            this._super(p, {
                sheet: "tiles",
                sprite: "piper",
                frame: 10
            });

            this.add('2d');

        },
    });

    /* -+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
                                                       PIPERRIGHTDOWN
          -+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+*/

    Q.Sprite.extend("PiperRightDown", {
        init: function(p) {
            this._super(p, {
                sheet: "tiles",
                sprite: "piper",
                frame: 48
            });

            this.add('2d');
        },
    });


/* -+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
                                                LOAD
   -+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+*/
    Q.load(["mario_small.png", "mario_small.json", "goomba.png", "goomba.json", "bloopa.png", "bloopa.json", "princess.png", "mainTitle.png", "coin.png", "coin.json", "tiles.png", "block.json", "1up_mushroom.gif"], function() {
        Q.compileSheets("mario_small.png", "mario_small.json", "coin.png", "coin.json");
        Q.compileSheets("goomba.png", "goomba.json");
        Q.compileSheets("coin.png", "coin.json");
        Q.compileSheets("tiles.png", "block.json");
        Q.compileSheets("bloopa.png", "bloopa.json");
        Q.loadTMX("level.tmx", function() {
            Q.stageScene("startGame");
        });
    });
    Q.load(["coin.mp3", "coin.ogg", "music_die.mp3", "music_die.ogg", "music_level_complete.mp3", "music_level_complete.ogg", "music_main.mp3", "music_main.ogg", "jump_small.mp3", "jump_small.ogg", "kill_enemy.mp3", "kill_enemy.ogg", "1up.mp3", "1up.ogg", "item_rise.mp3", "item_rise.ogg"]);



};