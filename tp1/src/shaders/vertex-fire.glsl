attribute vec3 aPosition;
attribute vec3 aNormal;
attribute vec2 aTextureUV;

uniform mat4 cameraMatrix;   // matriz de camara
uniform mat4 projMatrix;     // matriz de proyeccion
uniform mat4 modelMatrix;    // matriz de modelado

varying vec2 vTextureCoord;

void main() {
    vec4 modelPosition = modelMatrix * vec4(aPosition, 1);
    vTextureCoord = aTextureUV;
    gl_Position = projMatrix * cameraMatrix * modelPosition;
}
