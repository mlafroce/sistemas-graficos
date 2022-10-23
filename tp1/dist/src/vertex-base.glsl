attribute vec3 a_position;

uniform mat4 cameraMatrix;     // matriz de modelado
uniform mat4 projMatrix;     // matriz de modelado

varying vec4 colorPos;

void main() {
    colorPos = vec4(a_position, 1);
    gl_Position = projMatrix * cameraMatrix * vec4(a_position, 1);
}
