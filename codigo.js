window.onload = function(){
	start();
}

var key = {//teclas a usar
	space: 32,
	activo: false
}

var bposx=450;
var bposy=200;
var band=1;

var images = {//imagenes utilizadas
	bg: new Image(),
	pbird: new Image(),
	bullet: new Image(),
	pbirddie: new Image(),
	bulletexplo: new Image(),
	piso: new Image(),
	tubos: new Image(),
	inicio: new Image(),
	pbirddieCargado: false,
	bgCargado: false,
	inicioCargado: false,
	pbirdCargado: false,
	pisoCargado: false,
	tubosCargado: false,
	bulletCargado: false,
	bulletexploCargado: false,
}

//carga de imagenes(direcciones)
var srcs = {
	bgsrc: "img/fondo.png",
	bulletsrc: "img/bullet.png",
	bulletexplotsrc: "img/bulletexplo.png",
	pbirdsrc: "img/bird.png",/////////////////////////////////////////////
	pbirddiesrc: "img/birddie.png",
	pisosrc: "img/piso.png",
	tubossrc: "img/tubos.png",
	iniciosrc: "img/inicio.png"
}

//datos iniciales para el bird 
var personaje = function(){//datos del personaje
	this.alto = 200;
	this.gravedad = 0.1;
	this.vivo = true;
	this.salto = 0;
	this.aceleracion = 0.4;
	this.posx = 100;
	this.entre = false;
}

var balas = function(){//datos del personaje
	
	this.posx = 200;//puede ser random
}

var tubos = function(){//variables para el tubo
	this.Xmax;
	this.Xmin;
	this.aparece;
	this.desaparece;
	this.alto;
	this.posx;
	this.posy;
}

var juego = function(){//variables de estados para el juego
	this.estado = 1;
	this.maximo = 0;
	this.actual = 0;

	// 1 no iniciado // 2 en juego // 3 perdido;
}

//inicializacion de la variable partida y el estado
var partida = new juego();
partida.estado = 1;

//Generador de las posiciones de los tubos(que tan alto o bajo)
function generarAlto(){
	max = 280;
	min= 100;
	var alto = Math.floor((Math.random()*(max-min+1))+min);
	alto *= -1;
	return alto;
}

//el espacio para pasar entre los tubos
function verAlto(tubo){
	alto= tubo.alto + 312;
	return alto;
}

var canvas;
var ctx;
var pbird = new personaje();////////////////////////////////////////////////////
var bala = new balas();
var tap;
var isTouch = (('ontouchstart' in window) || (navigator.msMaxTouchPoints > 0));



function start(){

	if (!isTouch) {
		tap = new Audio("sound/tap.mp3");
	};
	


	canvas = document.getElementById("micanvas");
	canvas.width = 500;
	canvas.height = 500;


	ctx = canvas.getContext("2d");
	images.bg.src = srcs.bgsrc;
	images.bullet.src = srcs.bulletsrc;/////
	images.bulletexplo.src = srcs.bulletexplosrc;/////
	images.piso.src = srcs.pisosrc;
	images.pbird.src = srcs.pbirdsrc;///////////////////////////////
	images.pbirddie.src = srcs.pbirddiesrc;
	images.tubos.src = srcs.tubossrc;
	images.inicio.src = srcs.iniciosrc;
	images.bg.onload = function(){
		images.bgCargado = true;
		dibujar();
	}
	images.piso.onload = function(){
		images.pisoCargado = true;
		dibujar();
	}
	images.bullet.onload = function(){
		images.bulletCargado = true;
		dibujar();
	}
	images.bulletexplo.onload = function(){
		bulletexploCargado = true;
		dibujar();
	}
	images.pbird.onload = function(){
		images.pbirdCargado = true;//////////////////////////////////
		dibujar();
	}
	images.tubos.onload = function(){
		images.tubosCargado = true;
		dibujar();
	}
	images.pbirddie.onload = function(){
		images.pbirddieCargado = true;
		dibujar();
	}
	images.inicio.onload = function(){
		images.inicioCargado = true;
		dibujar();
	}

	ejecutarEventos();

}

var contador = 0;

var tubo = new Array(3);
for (var i = tubo.length - 1; i >= 0; i--) {
	tubo[i] = new tubos();
};

window.requestAnimFrame = (function(){
  return  window.requestAnimationFrame       ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame    ||
          function( callback ){
            window.setTimeout(callback, 1000 / 60);
          };
})();


function dibujar(){
	if (images.bgCargado) {
		ctx.drawImage(images.bg,0,0);		
	};

	if (images.tubosCargado) {
		animarTubos()
	};

	if (images.pbirdCargado){////////////////////
		animarpbird();///////////////////////////////////////////////
	};

	if (images.bulletCargado){////////////////////
		animarbullet();///////////////////////////////////////////////
	};

	if (images.pisoCargado) {
		ctx.drawImage(images.piso,0,420);	
	};

	if (partida.estado == 1 && images.inicioCargado) {
		ctx.drawImage(images.inicio,20,40);	
	};

	ctx.font = " bold 60px Neue";
	ctx.fillStyle = "#F7F7F7";
	
	if (partida.estado == 2) {
		ctx.fillText(partida.actual, 248, 50);
	};

	if (partida.estado == 3) {///Frame para cuando termina el juego
		ctx.fillStyle = "rgba(0,128,255,0.7)";
		ctx.fillRect(20,120,460,240);
		ctx.font = " bold 55px Helvetica Neue";
		ctx.fillStyle = "#FFFFFF";
		ctx.fillText("Actual:   " + partida.actual, 140, 230);
		ctx.fillStyle = "#F8D927";
		ctx.fillText("Record:  " + partida.maximo, 140, 300);
	};

	ctx.fillStyle = "#F7F7F7";

	ctx.font = " bold 60px Neue";
	ctx.fillStyle = "#F7F7F7";


	ctx.font = " normal 18px Helvetica Neue";
	ctx.fillText("Record: " + partida.maximo, 10, 490);

	requestAnimFrame(dibujar);

};

//funciones utlizadas		

function animarTubos(){
	var espacio = 300;

	for (var i = tubo.length - 1; i >= 0; i--) {
		if (tubo[i].alto==undefined){ // si no ha iniciado se inicia
			tubo[i].alto = generarAlto(); // se genera una alto random
			tubo[i].posx = (i*espacio)+510; //510 es el ancho del canvas
		}
		if (tubo[i].posx < -80) { // si pasa el canvas el tubo se reiniciar su posicion
			if(i-1 < 0){ // si al restar un tubo da -1
				tubo[i].posx = tubo[2].posx + espacio; // se agarra la posicion del tubo 2
			}
			else{ // si no solo se le resta uno a la posicion actual
				tubo[i].posx = tubo[i-1].posx + espacio; 
			}
			// si no, si la posicion del tubo esta entre la posicion del pbird cuando pasa por el
			//                 + 5 representa un que tiene 5px de ventaja 
		}else if((tubo[i].posx + 5 > pbird.posx & tubo[i].posx< pbird.posx + images.pbird.width - 5) || (tubo[i].posx + images.tubos.width > pbird.posx & tubo[i].posx + images.tubos.width < pbird.posx + images.pbird.width) ){
			
			if (pbird.alto < verAlto(tubo[i])) { // si cuando pbird esta pasando por los tubos y choca con la parte superior
				//perdio :s
				pbird.vivo = false; // muerto
			}else if(pbird.alto + images.pbird.height > verAlto(tubo[i]) + 152 ){ // si pbird toca por la parte inferior del tuvo pierde
				pbird.vivo = false;
			}
			else{
				pbird.entre = true;
			}
		}
		else if(tubo[i].posx < 100 - images.pbird.width && pbird.entre){ // si pasa el tubo se agrega 1 mas a la actual
			partida.actual++;
			if (partida.actual > partida.maximo) {
				partida.maximo = partida.actual;
			};
			pbird.entre = false;
		}
		
	};

	//velocidad con la que los tubos van apareciendo en las posiciones ya marcadas
	var aceleracion = 0.5;
	if (pbird.vivo & partida.estado == 2) {
		tubo[0].posx -= aceleracion;
		tubo[1].posx -= aceleracion;
		tubo[2].posx -= aceleracion;
	};
	//dibujo de los tubos bajo y alto
	ctx.drawImage(images.tubos,tubo[0].posx,tubo[0].alto);
	ctx.drawImage(images.tubos,tubo[1].posx,tubo[1].alto);
	ctx.drawImage(images.tubos,tubo[2].posx,tubo[2].alto);
}


var aceleracioninicio = 0.4;

function animarpbird(){
	var aceleracion = 0.02;
	var maxAceleracion = 2.3  ;
	

	if(images.pbirddieCargado && partida.estado == 1){
		ctx.drawImage(images.pbird,pbird.posx,pbird.alto);

		
		if (pbird.alto < 170) {
			aceleracioninicio += 0.0017;
		}
		else if (pbird.alto > 220) {
			aceleracioninicio -= 0.017;
		}

		pbird.alto += aceleracioninicio;
	}
	if(images.pbirddieCargado && partida.estado == 2) {
		
		
		if (pbird.alto <= 420-images.pbird.height){
			ctx.drawImage(images.pbird,pbird.posx,pbird.alto);

			if (pbird.aceleracion < maxAceleracion) {
				pbird.aceleracion += aceleracion  ;
			}else{
				pbird.aceleracion = maxAceleracion;
			}

			if(key.activo){
				key.activo = false;
				pbird.aceleracion = 1.72 *-1;  
			}
			
			if (pbird.alto + pbird.aceleracion > 0) {
				pbird.alto += pbird.aceleracion;	
			};
			
		}
		else{
			pbird.vivo = false;
			partida.estado = 3;
		}
		if (!pbird.vivo){
			ctx.drawImage(images.pbirddie,pbird.posx,pbird.alto);
		}
	}

	if (partida.estado==3) {
		ctx.drawImage(images.pbirddie,pbird.posx,pbird.alto);
	};

}

function animarbullet(){

	if(partida.estado == 2){
		ctx.drawImage(images.bullet,bposx,bposy);
		bposx=bposx-1;
		if(bposx<=0){
		bposx=450;
		bposy = Math.floor((Math.random()*(400-100+1))+min);
		}
		//alert(pbird.alto+" / "+ bposy);
		if(100==bposx){
			//alert(pbird.alto+" / "+ bposy);
			if(bposy+50>=pbird.alto && bposy-50<=pbird.alto){
			pbird.vivo = false;
			//ctx.drawImage(images.bulletexplo,bposx,bposy);
		}
			
		}

	}
}

document.addEventListener("keydown",function(e){
	if (e.keyCode == key.space) {
		c()
	}; 
	e.preventDefault();
});


function ejecutarEventos(){
	

	if (isTouch) {
		document.getElementById("mitap").style.display = "block";
		document.getElementById("mitap").addEventListener("touchstart",function(e){
			c();
		});
	}else{
		document.getElementById("mitap").style.display = "none";
	}

	
	document.getElementById("micanvas").addEventListener("mousedown",function(e){
		e.preventDefault();
		c();
	});
}




function c(){
	if (partida.estado ==1) {
		partida.estado = 2;
	};
	if (partida.estado == 2 & pbird.vivo) {
		key.activo = true;
		if (!isTouch) {
			tap.play();
		};
	};	
	resetear();
}

function resetear(){
	if (!pbird.vivo && partida.estado==3) {
		partida.estado = 1;
		partida.actual = 0;
		bposx=450; band=1;
		bposy = Math.floor((Math.random()*(400-100+1))+min);
		pbird.vivo = true;
		for (var i = tubo.length - 1; i >= 0; i--) {
			tubo[i].alto = undefined;
		};
		pbird = new personaje();
	};

}


