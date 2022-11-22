// fragment shaders don't have a default precision so we need to pick one
precision mediump float;

uniform mat2 textureMatrix;  // matriz de corrección de normales
uniform vec4 modelColor;     // color default
uniform int nTextures;     // cantidad de texturas disponibles
uniform sampler2D uSampler;

varying vec3 vPosition;
varying vec3 vNormal;
varying vec2 vTextureCoord;

vec3 directionalLight(vec3 lightPos, vec3 color) {
    vec3 lightVec= normalize(lightPos - vPosition);
    return color * max (dot(vNormal, lightVec), 0.0);
}

vec3 diffuseLight(vec3 torchPos, vec3 torchColor, float distanceFactor) {
    vec3 torchLightVec= torchPos - vPosition;
    float torchIntensity = max(0.0, 1.0 - length(torchLightVec) * distanceFactor);
    return torchColor * max (dot(vNormal, normalize(torchLightVec)), 0.0) * torchIntensity;
}

void main() {
    vec3 torchPos = vec3(1, -2.0, 1.0);
    vec3 ambientLightVec = directionalLight(vec3(0.0, -10.0, 10.0), vec3(1, 1, 1));
    vec3 torchLight = ambientLightVec + diffuseLight(torchPos, vec3(1, 0.95, 0.8), 0.25);

    vec3 outputColor;
    if (nTextures > 0 ) {
        vec2 wrappedTextureCoord = textureMatrix * vTextureCoord;
        outputColor = torchLight * texture2D(uSampler, wrappedTextureCoord).xyz;
    } else {
        outputColor = torchLight * modelColor.xyz;
    }
    gl_FragColor = vec4(outputColor, 1);
}
