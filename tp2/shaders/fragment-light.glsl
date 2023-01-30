precision mediump float;

varying vec3 vPosition;
varying vec3 vNormal;

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
    gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
}
