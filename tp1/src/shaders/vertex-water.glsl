precision mediump float;

attribute vec3 aPosition;
attribute vec3 aNormal;
attribute vec3 aTextureUV;

uniform mat4 cameraMatrix;   // matriz de modelado
uniform mat4 projMatrix;     // matriz de proyeccion
uniform mat4 modelMatrix;    // matriz de modelado
uniform mat3 normalMatrix;   // matriz de corrección de normales
uniform mat2 textureMatrix;  // matriz de corrección de texturas
uniform vec4 modelColor;     // color default
uniform int nTextures;     // cantidad de texturas disponibles
uniform float clockTick;

uniform sampler2D noise1Sampler;
uniform sampler2D noise2Sampler;

varying vec3 vPosition;
varying vec3 vNormal;

void main() {
    float noiseValue1 = texture2D(noise1Sampler, vPosition.xy * 0.5).x * 0.4;
    float noiseValue2 = texture2D(noise2Sampler, vPosition.xy * 0.25).x * 0.3;
    float mixValue = sin(clockTick / 50.0) * 0.5 + 0.5;
    float currentNoise = mix(noiseValue1, noiseValue2, mixValue) * 0.2;
    vec4 modelPosition = modelMatrix * vec4(aPosition.xy, aPosition.z + currentNoise, modelColor.a);
    vPosition = modelPosition.xyz;
    vNormal = aNormal;

    gl_Position = projMatrix * cameraMatrix * modelPosition;
}
