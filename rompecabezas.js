
/*                V A R I A B L E S  G L O B A L E S
===================================================================
Variable          Valor                       Descripción        */

var RUTA          = '';  // ruta de la imagen
var N             = 0;   // numero de piezas (N^2)
var X             = 0;   // posicion (X) del espacio en blanco
var Y             = 0;   // posicion (Y) del espacio en blanco
var TAMANIO       = 0;   // tamaño de cada pieza en pixeles
var ID_ESPACIO    = '';  // id del espacio en blanco
var ORDEN         = '';  // el orden de las piezas
var MOVIMIENTOS   = 0;   // numero de movimientos

function cargarRompecabezas(defaultPath, size) {
  document.getElementById('area').className='';
  RUTA = defaultPath;

  var divMiniatura = document.getElementById('divminiatura');
  divMiniatura.style.height = size+'px';
  divMiniatura.style.width = size+'px';
  divMiniatura.style.backgroundImage = 'url("'+RUTA+'")';
}

function piezaID(x,y) {
  return '_' + ( (x-1) * N + y );
}

function arregloID(x,y) {
  return (x-1) * N + y - 1;
}

function establecerEspacio(x,y) {
  X = x;
  Y = y;
  ID_ESPACIO = piezaID(x,y);
}

function aleatorio(movimientos) {
  return movimientos.substr( Math.floor(movimientos.length * Math.random()), 1);
}

function validarRuta() {
  var lblResultado = document.getElementById('lblresultado');
  var ruta = document.getElementById('txtimagen').value;

  if (ruta == '') { //si no se seleccinó ningún archivo
    lblResultado.innerHTML = 'no ha seleccionado ningun archivo';
    return false;
  }
  
  var extensiones = new Array('.gif', '.jpg', '.jpeg', '.png', '.bmp');
  var extension = ( ruta.substring( ruta.lastIndexOf('.') ) ).toLowerCase();
  var permitida = 'no';

  for (var i = 0; i < extensiones.length; i++) { // valida la extensión de la imagen
    if (extensiones[i] == extension) {
      permitida = 'si';
      lblResultado.innerHTML = '';
    }
  }

  if (permitida == 'no') { // si no es una imagen se muestra mensaje de error
    lblResultado.innerHTML = 'El archivo seleccionado no es una imagen';
    return false;
  }

 
  RUTA = ruta;
  verImagen();
}


function verImagen() {
  var divMiniatura = document.getElementById('divminiatura');
  var area = document.getElementById('area');

  imgMuestra = new Image();

  imgMuestra.src = RUTA;

  var ancho = Math.min( area.offsetWidth-100, imgMuestra.width, imgMuestra.height );
  divMiniatura.style.height = ancho+'px';
  divMiniatura.style.width = ancho+'px';
  divMiniatura.style.backgroundImage = 'url("'+RUTA+'")';
}

function generar() {
  var area = document.getElementById('area');
  var divMiniatura = document.getElementById('divminiatura');
  N = parseInt( document.getElementById('cmbpiezas').value.substring(6) );
  TAMANIO = Math.floor(divMiniatura.offsetWidth / N) ;
  celdaId='';

  //se quita la tabla de opciones
  area.removeChild(document.getElementById('opciones'));
    
  //se crea un arreglo para contener los ids de las piezas
  PIEZAS = new Array(Math.pow(N,2));
  var ID = 0;
  
  for (var y = 1; y <= N; y++ ) {
    for(var x = 1; x <= N; x++ ) {
      PIEZAS[arregloID(x,y)] = piezaID(x,y);
    }
  }
  
  //concatena el arreglo PIEZAS en la variable ORDEN
  ORDEN = PIEZAS.join('');
  
  establecerEspacio(N, N);
  desarmarRompecabezas();
  
  
  //Creamos la seccion de numero de movimientos
  var divMovimientos = document.createElement('div');
  var etiqueta = document.createElement('label');
  var movimientos = document.createElement('label');
  
  divMovimientos.id = 'divmovimientos';
  
  etiqueta.innerHTML = 'Numero de movimientos realizados:';
  etiqueta.className = 'etiqueta';
  movimientos.innerHTML = '0';
  movimientos.id = 'movimientos';
  
  area.appendChild(divMovimientos);
  divMovimientos.appendChild(etiqueta);
  divMovimientos.appendChild(movimientos);
  
  //crea un boton para reiniciar el juego (para no tener que presionar F5)
  var cmdreiniciar = document.createElement('input');
  cmdreiniciar.id = 'cmdreiniciar';
  cmdreiniciar.type = 'button';
  cmdreiniciar.value = 'Reiniciar Juego';
  cmdreiniciar.onclick = function() { location.href = location.href };
  divMovimientos.appendChild(cmdreiniciar);
  
  //crea una nueva tabla, para las piezas
  var tabla = document.createElement('table');
  var tableboby = document.createElement('tbody');
  tabla.setAttribute('id','tablapiezas');

  area.appendChild(tabla);
  tabla.appendChild(tableboby);
  
  //crea primero las filas y celdas...
  for (var x = 1; x <= N; x++ ) {
    var fila = document.createElement('tr');
    tableboby.appendChild(fila); 
    for(var y = 1; y <= N; y++ ) {
      var celda = document.createElement('td');
      celda.setAttribute('id', 'c' + piezaID(x,y));
      fila.appendChild(celda);
    }
  }
  
  //...luego cada pieza
  for  (var x = 1; x <= N; x++ ) {
    for(var y = 1; y <= N; y++ ) {
      celdaId = 'c' + piezaID(x,y);
      crearPieza(x, y, celdaId);
    }
  }
}

function desarmarRompecabezas() {
  var x = X;
  var y = Y;
  var direcciones = '';
  var direccion = '';
 
  var id1 = 0;
  var id2 = 0;
  var cambio = 0;

  var cambiar = false;
  var alertas = '';
  for (var mov = 0; mov < Math.pow(N,4); mov++) {
    if (x < N && direccion != 'U' ) {direcciones += 'D';}
    if (x > 1 && direccion != 'D' ) {direcciones += 'U';}
    if (y > 1 && direccion != 'R' ) {direcciones += 'L';}
    if (y < N && direccion != 'L' ) {direcciones += 'R';}
    direccion = aleatorio(direcciones);
    
    switch (direccion) {
    case 'U':
      id1 = arregloID(x,y);
      id2 = arregloID(x-1,y);
      x--;
      cambiar = true;
      break;
    case 'D':
      id1 = arregloID(x,y);
      id2 = arregloID(x+1,y);
      x++;
      cambiar = true;
      break;
    case 'L':
      id1 = arregloID(x,y);
      id2 = arregloID(x,y-1);
      y--;
      cambiar = true;
      break;
    case 'R':
      id1 = arregloID(x,y);
      id2 = arregloID(x,y+1);
      y++;
      cambiar = true;
      break;
    }//switch
    cambio = PIEZAS[id1];
    PIEZAS[id1] = PIEZAS[id2];
    PIEZAS[id2] = cambio;
    cambiar = false;
    direcciones = '';
  }
  establecerEspacio(x,y);
}

function crearPieza(x, y, idLugar) {
  var IDpieza = piezaID(x, y);
  
  var idpieza = PIEZAS[arregloID(x,y)];
  
  var nID = parseInt( idpieza.substr(1) );
  x = ( (nID-1) % N ) + 1;
  y = Math.ceil(nID / N) ;

  var lugar = document.getElementById(idLugar);
  var pieza = document.createElement('a');
  pieza.className = 'pieza';
  pieza.setAttribute('id', IDpieza );
  pieza.onclick = function() { cambiarPieza(this) };

  pieza.style.width = TAMANIO + 'px'; 
  pieza.style.height = TAMANIO + 'px';
  pieza.style.backgroundImage = 'url("' + RUTA + '")';
  pieza.style.backgroundPosition = TAMANIO*(x-1)*(-1) + 'px ' + TAMANIO*(y-1)*(-1) + 'px';
  
  if (IDpieza == ID_ESPACIO) {
    pieza.style.display = 'none';
  }

  lugar.appendChild(pieza);

}

function cambiarPieza(pieza) {
  var IDpieza = pieza.getAttribute('id');
  var nID = parseInt( IDpieza.substr(1) );
  var y = ( (nID-1) % N ) + 1;
  var x = Math.ceil(nID / N) ;
  
  if ((x != X && y != Y) || (IDpieza == ID_ESPACIO)) return;
  
  if (x != X) {
    var dir = 'V';
    var i = (x < X) ? -1 : 1;
    var posicion = X;
    var limite = x;
  } else {
    var dir = 'H';
    var i = (y < Y) ? -1 : 1;
    var posicion = Y;
    var limite = y;
  }

  var id1 = 0;
  var id2 = 0;
  var idPieza1 = '';
  var idPieza2 = '';
  var cambio = '';
  
  while (posicion != limite) {
    id1 = (dir == 'V') ? arregloID( posicion,y ) : arregloID( x,posicion );
    id2 = (dir == 'V') ? arregloID(posicion+i,y) : arregloID(x,posicion+i);
    idPieza1 = (dir == 'V') ? piezaID( posicion,y ) : piezaID( x,posicion );
    idPieza2 = (dir == 'V') ? piezaID(posicion+i,y) : piezaID(x,posicion+i);
    
    var pieza1 = document.getElementById(idPieza1);
    var pieza2 = document.getElementById(idPieza2);
    
    cambio = PIEZAS[id1];
    PIEZAS[id1] = PIEZAS[id2];
    PIEZAS[id2] = cambio;
    
    cambio = pieza1.style.backgroundPosition;
    pieza1.style.backgroundPosition = pieza2.style.backgroundPosition;
    pieza2.style.backgroundPosition = cambio;
    
    cambio = pieza1.style.display;
    pieza1.style.display = pieza2.style.display;
    pieza2.style.display = cambio;
    
    posicion += i;
    
  }//while
  
  MOVIMIENTOS++;
  document.getElementById('movimientos').innerHTML = MOVIMIENTOS;
  
  establecerEspacio(x,y);
  if (PIEZAS.join('') == ORDEN) {juegoTerminado();}
  
}


function juegoTerminado() {
  
  var area = document.getElementById('area');
  area.removeChild(document.getElementById('tablapiezas'));
  area.removeChild(document.getElementById('divmovimientos'));
  
  var contenedor = document.createElement('div');
  var titulo = document.createElement('h1');
  var texto = document.createElement('p');
  var label1 = document.createElement('label');
  var label2 = document.createElement('label');
  var imagen = document.createElement('div');
  var boton = document.createElement('input');
  contenedor.className = 'contenedor';
  titulo.innerHTML = '¡FELICIDADES!';
  texto.innerHTML = 'Felicidades has logrado armar el rompecabezas de '+N+'x'+N+' piezas, si quieres puedes seguir jugando seleccionando cualquier imagen de la web y con el numero de piezas que prefieras. ¡Gracias por haber jugado!';
  boton.id = 'cmdreiniciar';
  boton.type = 'button';
  boton.value = 'Reiniciar Juego';
  boton.onclick = function() { location.href = location.href };
  label1.innerHTML = 'Total de movimientos realizados:';
  label1.className = 'etiqueta';
  label2.innerHTML = MOVIMIENTOS;
  imagen.style.backgroundImage = 'url("'+RUTA+'")';
  imagen.style.height = N * TAMANIO + 'px';
  imagen.style.width = N * TAMANIO + 'px';
  imagen.style.marginTop = '30px';
  
  area.appendChild(contenedor);
  contenedor.appendChild(titulo);
  contenedor.appendChild(texto);
  contenedor.appendChild(label1);
  contenedor.appendChild(label2);
  contenedor.appendChild(boton);
  contenedor.appendChild(imagen);
  
}



