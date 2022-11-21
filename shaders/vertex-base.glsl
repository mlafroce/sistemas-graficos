attribute vec3 a_position;
attribute vec3 aNormal;
attribute vec2 aTextureUV;

uniform mat4 cameraMatrix;   // matriz de modelado
uniform mat4 projMatrix;     // matriz de proyeccion
uniform mat4 modelMatrix;    // matriz de modelado
uniform mat3 normalMatrix;    // matriz de corrección de normales
uniform mat2 textureMatrix;    // matriz de corrección de normales
uniform vec4 modelColor;     // color default
uniform float nTextures;      // cantidad de texturas disponibles

varying vec3 vPosition;
varying vec3 vNormal;
varying vec4 vColor;
varying vec2 vTextureCoord;
varying mat2 vTextureMatrix;
varying float vNTextures;

void main() {
    vPosition = vec3(modelMatrix * vec4(a_position, 1));
    vColor = modelColor;
    vTextureCoord = aTextureUV;
    vNormal = normalize(normalMatrix * aNormal);
    vNTextures = nTextures;
    vTextureMatrix = textureMatrix;
    gl_Position = projMatrix * cameraMatrix * modelMatrix * vec4(a_position, 1);
}
