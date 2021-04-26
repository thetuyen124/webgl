var main = function () {
    var CANVAS = document.getElementById("your_canvas");
    CANVAS.width = window.innerWidth;
    CANVAS.height = window.innerHeight;

    /*========================= CAPTURE MOUSE EVENTS ========================= */
    
    MOUSE.initialize(CANVAS);

    /*========================= GET WEBGL CONTEXT ========================= */
    var GL; // Se crea la variable webl
    try {
        GL = CANVAS.getContext("experimental-webgl", {antialias: true});
    } catch (e) {
        alert("You are not webgl compatible :(");
        return false;
    }

    /*========================= SHADERS ========================= */ 
    
    SHADERS.initialize(GL);

    /*========================= THE MODEL ====================== */
    //(khoảng cách, tốc dộ quay, tự quay, dừng)
    var sun = new Astro(0, 0, 0.005, true);
    sun.model(GL, 0.8 / 2, "res/sun.jpg");
     
    var venus = new Astro(0.7, 0.003, 0.005, true);
    venus.model(GL, 0.07 / 2, "res/venus.jpg");

    var mercury = new Astro(0.6, 0.006, 0.005, true);
    mercury.model(GL, 0.05 / 2, "res/mercury.png");

    var earth = new Astro(0.8, 0.007, 0.005, true);
    earth.model(GL, 0.04 / 2, "res/tierra.jpg");

    var luna = new Astro(0.03, 0.05, 0, true);
    luna.model(GL, 0.009 / 2, "res/luna.jpg");

    var mars = new Astro(0.9, 0.008, 0.005, true);
    mars.model(GL, 0.04 / 2, "res/mars.png");

    var jupiter = new Astro(1.25, 0.008, 0.005, true);
    jupiter.model(GL, 0.15 / 2, "res/jupiter.jpg");
    
    sun.addSatelite(mercury);
    sun.addSatelite(venus);
    sun.addSatelite(earth);
    sun.addSatelite(mars);
    sun.addSatelite(jupiter);

    earth.addSatelite(luna);

    /*========================= MATRIX ========================= */

    var PROJMATRIX = LIBS.getProjection(40, CANVAS.width / CANVAS.height, 1, 100); // Se establece la matriz de proyección
    var MOVEMATRIX = LIBS.getI4(); // Se inicia la matriz de movimiento como la matriz identidad
    var VIEWMATRIX = LIBS.getI4(); // Se inicia la matriz de vista como la matriz identidad

    LIBS.translateZ(VIEWMATRIX, -3); // Se traslada la cámara hacia atrás realizando una traslación sobre la matriz de vista
    
    var THETA = 0, PHI = 0; // Variables usadas para el movimiento

    /*========================= DRAWING ========================= */
    GL.enable(GL.DEPTH_TEST); // Se habilita el buffer test de profundidad
    GL.depthFunc(GL.LEQUAL); // Especifica el valor usado para las comparaciones del buffer de profundidad
    GL.clearColor(0.0, 0.0, 0.0, 0.0); // Se asigna el clear color como transparente
    GL.clearDepth(1.0); // Se asigna el valor de limpieza para el buffer de profundidad a 1
    
    var draw = function () { // Esta función dibuja la escena
        LIBS.setI4(MOVEMATRIX);             // Se le da la matriz de identidad como valor a la matriz de movimiento
        
        GL.viewport(0.0, 0.0, CANVAS.width, CANVAS.height); // Establece el área de dibujado
        GL.clear(GL.COLOR_BUFFER_BIT | GL.DEPTH_BUFFER_BIT); // La limpia
        
        GL.uniformMatrix4fv(SHADERS._Mmatrix, false, MOVEMATRIX); // Se asigna la matriz de modelo 
        GL.uniformMatrix4fv(SHADERS._Pmatrix, false, PROJMATRIX); // Se asigna la matriz de proyección
        GL.uniformMatrix4fv(SHADERS._Vmatrix, false, VIEWMATRIX); // Se asigna la matriz de vista
        
        sun.draw(GL, new Stack()); // Astro sobre el que giran el resto de astros

        GL.flush(); // Se fuerza el dibujado
        window.requestAnimationFrame(draw); // Vuelve a pintar la escena
    };
    
    draw(); // Se inicia el dibujado
};