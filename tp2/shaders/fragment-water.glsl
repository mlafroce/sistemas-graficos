precision mediump float;

uniform sampler2D noise1Sampler;
uniform sampler2D noise2Sampler;
uniform bool viewNormals;
uniform vec4 modelColor;     // color default
uniform float clockTick;
uniform vec3 lightList[2];
uniform vec3 eyePos;
uniform float shininess;

varying vec3 vPosition;
varying vec3 vNormal;
varying vec4 vColor;

const vec3 torchLightColor = vec3(1, 0.95, 0.8);

vec3 reflectionLight(vec3 torchPos, vec3 torchColor) {
    vec3 lightVec = normalize(torchPos - vPosition);
    vec3 reflectionNormal = 2.0 * dot(lightVec, vNormal) * vNormal - lightVec;
    vec3 eyeVec = normalize(eyePos * 0.5 - vPosition);
    float distanceFactor = max(0.5, 1.0 / length(torchPos - vPosition));
    float reflection = max(dot(reflectionNormal, eyeVec), 0.0);
    float reflectionIntensity = pow(reflection, 30.0);
    return torchColor * reflectionIntensity * distanceFactor;
}

void main() {
    vec3 outputColor;

    float noiseValue1 = texture2D(noise1Sampler, vPosition.yx * 0.5).x * 0.4 + 0.5;
    float noiseValue2 = texture2D(noise2Sampler, vPosition.yx * 0.25).x * 0.3 + 0.5;
    float mixValue = sin(clockTick / 40.0) * 0.5 + 0.5;
    float currentNoise = mix(noiseValue1, noiseValue2, mixValue);

    vec3 torchLight = vec3(0, 0, 0);
    for (int i = 0; i < 2; i++) {
        vec3 torchPos = lightList[i];
        torchLight += reflectionLight(torchPos, torchLightColor);
    }

    // TODO: use normals shader
    if (viewNormals) {
        gl_FragColor = vec4(vNormal * 0.5 + vec3(0.5, 0.5, 0.5), 1);
    } else {
        gl_FragColor = vec4(torchLight + modelColor.xyz * currentNoise , 1);
    }
}
