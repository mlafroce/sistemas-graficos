attribute vec3 a_position;
attribute vec3 aNormal;

uniform mat4 cameraMatrix;   // matriz de modelado
uniform mat4 projMatrix;     // matriz de proyeccion
uniform mat4 modelMatrix;    // matriz de modelado
uniform mat3 normalMatrix;    // matriz de corrección de normales
uniform vec4 modelColor;

varying vec3 vPosition;
varying vec3 vNormal;
varying vec4 vColor;

void main() {
    vPosition = vec3(modelMatrix * vec4(a_position, 1));
    vColor = modelColor;
    vNormal = normalize(normalMatrix * aNormal);
    gl_Position = projMatrix * cameraMatrix * modelMatrix * vec4(a_position, 1);
}
