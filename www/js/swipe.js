var transformProp = Modernizr.prefixed('transform');
var initializate = false;

function Carousel3D ( el ) {
    this.element = el;
    this.rotation = 0;
    this.panelCount = 0;
    this.totalPanelCount = this.element.children.length;
    this.theta = 0;

    this.isHorizontal = false;

}

Carousel3D.prototype.modify = function() {
    var panel, angle, i;

    this.panelSize = this.element[ this.isHorizontal ? 'offsetWidth' : 'offsetHeight' ];
    this.rotateFn = this.isHorizontal ? 'rotateY' : 'rotateX';
    this.theta = 360 / this.panelCount;

    // do some trig to figure out how big the carousel
    // is in 3D space
    this.radius = Math.round( ( this.panelSize / 2) / Math.tan( Math.PI / this.panelCount ) );

    for ( i = 0; i < this.panelCount; i++ ) {
        panel = this.element.children[i];
        angle = this.theta * i;
        panel.style.opacity = 1;
        panel.style.backgroundColor = 'hsla(' + angle + ', 100%, 50%, 0.8)';
        // rotate panel, then push it out in 3D space
        panel.style[ transformProp ] = this.rotateFn + '(' + angle + 'deg) translateZ(' + this.radius + 'px)';
    }

    // hide other panels
    for (  ; i < this.totalPanelCount; i++ ) {
        panel = this.element.children[i];
        panel.style.opacity = 0;
        panel.style[ transformProp ] = 'none';
    }

    // adjust rotation so panels are always flat
    this.rotation = Math.round( this.rotation / this.theta ) * this.theta;

    this.transform();
};

Carousel3D.prototype.transform = function() {
  var entero = Math.floor(this.rotation / 360 ) * 360;
  var rotat = this.rotation - entero;
  this.element.style[ transformProp ] = 'translateZ(-' + this.radius + 'px) ' + this.rotateFn + '(' + this.rotation + 'deg)';

  var msgOption = "";
  if (rotat == 0){
    msgOption = "SOLO TOMA el jugador que lanzo.";
    console.log(msgOption);
  }
  if (rotat == 300){
    msgOption = "El jugador que lanzo OBLIGA a otro jugador a servirse.";
    console.log(msgOption);
  }
  if (rotat == 240){
    msgOption = "El jugador que está a la DERECHA del jugador que lanzo se sirve.";
    console.log(msgOption);
  }
  if (rotat == 180){
    msgOption = "El jugador que está a la IZQUIERDA del jugador que lanzo se sirve.";
    console.log(msgOption);
  }
  if (rotat == 120){
    msgOption = "Todos TOMAN menos el jugador que lanzo.";
    console.log(msgOption);
  }
  if (rotat == 60){
    msgOption = "TODOS TOMAMOS hasta el fondo.";
    console.log(msgOption);
  }
  setTimeout( function(){
    if (initializate){
      $("#msgOption").text(msgOption);
      $("#msgWelcome").text("");
    }
  }, 1000);

};

var init = function() {

    var carousel = new Carousel3D(document.getElementById('carousel'));

    $(".contentCarousel").swipe( {
        swipe:function(event, direction, distance, duration, fingerCount, fingerData) {

            var base = (distance / 10);
            var squareBase = Math.pow(base, 2);

            var turns = Math.round(squareBase / 60 ) * 60;

            if (direction === 'up'){
                carousel.rotation += turns;
                carousel.transform();
            }
            if (direction === 'down'){
                carousel.rotation -= turns;
                carousel.transform();
            }
          initializate = true;
        }
    });

    carousel.panelCount = 6;
    carousel.modify();
    $("#msgOption").text("Bienvenido a TODI!!");
    $("#msgWelcome").text("Gira la ruleta y Juega con Responsabilidad.");

    setTimeout( function(){
        document.body.addClassName('ready');
    }, 0);

};

window.addEventListener('DOMContentLoaded', init, false);
