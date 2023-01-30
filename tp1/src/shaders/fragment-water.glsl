precision mediump float;

uniform sampler2D noise1Sampler;
uniform sampler2D noise2Sampler;
uniform bool viewNormals;
uniform vec4 modelColor;     // color default
uniform float clockTick;
uniform vec3 lightList[2];
uniform vec3 ambientLightColor;
uniform vec3 sunLightColor;
uniform vec3 torchLightColor;
uniform vec3 eyePos;
uniform vec3 sunLightPos;
uniform float shininess;

varying vec3 vPosition;
varying vec3 vNormal;
varying vec4 vColor;

vec3 directionalLight() {
    vec3 lightVec = normalize(sunLightPos - vPosition);
    return sunLightColor * max (dot(vNormal, lightVec), 0.0);
}

vec3 reflectionLight(vec3 torchPos) {
    vec3 lightVec = normalize(torchPos - vPosition);
    vec3 reflectionNormal = 2.0 * dot(lightVec, vNormal) * vNormal - lightVec;
    vec3 eyeVec = normalize(eyePos * 0.8 - vPosition);
    float distanceFactor = max(1.0, 10.0 / length(torchPos - vPosition));
    float reflection = max(dot(reflectionNormal, eyeVec), 0.0);
    float reflectionIntensity = pow(reflection, shininess);
    float shininessAttenuation = (10.0 + shininess) / 60.0;
    return torchLightColor * reflectionIntensity * distanceFactor * shininessAttenuation;
}

void main() {
    vec3 outputColor;

    float noiseValue1 = texture2D(noise1Sampler, vPosition.yx * 0.5).x * 0.4 + 0.5;
    float noiseValue2 = texture2D(noise2Sampler, vPosition.yx * 0.25).x * 0.3 + 0.5;
    float mixValue = sin(clockTick / 40.0) * 0.5 + 0.5;
    float currentNoise = mix(noiseValue1, noiseValue2, mixValue);

    vec3 sunLight = directionalLight();

    vec3 torchLight = vec3(0, 0, 0);
    for (int i = 0; i < 2; i++) {
        vec3 torchPos = lightList[i];
        torchLight += reflectionLight(torchPos);
    }

    vec3 light = torchLight + sunLight * 0.8 + ambientLightColor * 0.5;

    // TODO: use normals shader
    if (viewNormals) {
        gl_FragColor = vec4(vNormal * 0.5 + vec3(0.5, 0.5, 0.5), 1);
    } else {
        gl_FragColor = vec4(light * modelColor.xyz * currentNoise , 1);
    }
}
