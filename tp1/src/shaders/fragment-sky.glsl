// fragment shaders don't have a default precision so we need to pick one
precision mediump float;

uniform bool viewNormals;    // bool activa normales
uniform mat2 textureMatrix;  // matriz de corrección de normales
uniform vec4 modelColor;     // color default
uniform int nTextures;     // cantidad de texturas disponibles
uniform sampler2D uSampler;
uniform vec3 lightList[2];
uniform vec3 eyePos;

varying vec3 vPosition;
varying vec3 vNormal;
varying vec2 vTextureCoord;

void main() {
    vec3 outputColor;
    if (nTextures > 0 ) {
        vec2 wrappedTextureCoord = textureMatrix * vTextureCoord;
        outputColor = texture2D(uSampler, wrappedTextureCoord).xyz;
    }
    // TODO: use normals shader
    if (viewNormals) {
        gl_FragColor = vec4(vNormal * 0.5 + vec3(0.5, 0.5, 0.5), modelColor.a);
    } else {
        gl_FragColor = vec4(outputColor, modelColor.a);
    }
}
