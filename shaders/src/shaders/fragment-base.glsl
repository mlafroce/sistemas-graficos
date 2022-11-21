// fragment shaders don't have a default precision so we need to pick one
precision mediump float;

varying vec3 vPosition;
varying vec3 vNormal;
varying vec4 vColor;
varying vec2 vTextureCoord;
varying mat2 vTextureMatrix;
varying float vNTextures;

uniform sampler2D uSampler;

vec3 directionalLight(vec3 lightPos, vec3 color) {
    vec3 lightVec= normalize(lightPos - vPosition);
    return color * max (dot(vNormal, lightVec), 0.0);
}

vec3 diffuseLight(vec3 torchPos, vec3 torchColor, float distanceFactor) {
    vec3 torchLightVec= torchPos - vPosition;
    float torchIntensity = max(0.0, 1.0 - length(torchLightVec) / distanceFactor);
    return torchColor * max (dot(vNormal, normalize(torchLightVec)), 0.0) * torchIntensity;
}

void main() {
    vec3 torchPos = vec3(1, -2.0, 1.0);
    vec3 ambientLightVec = directionalLight(vec3(0.0, -10.0, 10.0), vec3(1, 1, 1));
    vec3 torchLight = ambientLightVec + diffuseLight(torchPos, vec3(1, 0.95, 0.8), 4.0);

    vec3 outputColor;
    if (vNTextures > 0.0 ) {
        vec2 wrappedTextureCoord = vTextureMatrix * vTextureCoord;
        outputColor = torchLight * texture2D(uSampler, wrappedTextureCoord).xyz;
        //outputColor = vec3(vec4(vTextureMatrix[0], vTextureMatrix[1]).xyz);
    } else {
        outputColor = torchLight * vColor.xyz;
    }
    // gl_FragColor = vNormal * 0.5 + vec3(0.5, 0.5, 0.5);
    gl_FragColor = vec4(outputColor, 1);
}
