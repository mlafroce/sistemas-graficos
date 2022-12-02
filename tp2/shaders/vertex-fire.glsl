attribute vec3 aPosition;

uniform mat4 cameraMatrix;   // matriz de camara
uniform mat4 projMatrix;     // matriz de proyeccion
uniform mat4 modelMatrix;    // matriz de modelado

varying vec3 vPosition;

void main() {
    vec4 modelPosition = modelMatrix * vec4(aPosition, 1);
    vPosition = aPosition;
    gl_Position = projMatrix * cameraMatrix * modelPosition;
}
