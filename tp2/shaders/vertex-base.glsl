attribute vec3 aPosition;
attribute vec3 aNormal;
attribute vec2 aTextureUV;

uniform mat4 cameraMatrix;   // matriz de modelado
uniform mat4 projMatrix;     // matriz de proyeccion
uniform mat4 modelMatrix;    // matriz de modelado
uniform mat3 normalMatrix;   // matriz de corrección de normales
uniform mat2 textureMatrix;  // matriz de corrección de texturas
uniform vec4 modelColor;     // color default
uniform int nTextures;     // cantidad de texturas disponibles

varying vec3 vPosition;
varying vec3 vNormal;
varying vec2 vTextureCoord;

void main() {
    vec4 modelPosition = modelMatrix * vec4(aPosition, 1);
    vPosition = modelPosition.xyz;
    vTextureCoord = aTextureUV;
    vNormal = normalize(normalMatrix * aNormal);
    gl_Position = projMatrix * cameraMatrix * modelPosition;
}
