attribute vec3 a_position;
attribute vec3 aNormal;

uniform mat4 cameraMatrix;   // matriz de modelado
uniform mat4 projMatrix;     // matriz de proyeccion
uniform mat4 modelMatrix;    // matriz de modelado
uniform vec4 modelColor;

varying vec4 colorPos;
varying vec3 vNormal;

void main() {
    //colorPos = vec4(a_position, 1);
    colorPos = modelColor;
    vNormal = aNormal;
    gl_Position = projMatrix * cameraMatrix * modelMatrix * vec4(a_position, 1);
}
