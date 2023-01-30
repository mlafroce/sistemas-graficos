precision mediump float;

uniform sampler2D grassSampler;
uniform sampler2D soilSampler;
uniform sampler2D noiseSampler;
uniform bool viewNormals;

uniform vec3 lightList[2];
uniform vec3 ambientLightColor;
uniform vec3 sunLightColor;
uniform vec3 torchLightColor;
uniform vec3 sunLightPos;

varying vec3 vPosition;
varying vec3 vNormal;
varying vec4 vColor;

const float torchMaxIntensity = 0.9;
const float sunlightIntensity = 0.8;
const float ambient = 0.8;

vec3 directionalLight() {
    vec3 lightVec = normalize(sunLightPos - vPosition);
    return sunLightColor * max (dot(vNormal, lightVec), 0.0) * sunlightIntensity;
}

vec3 diffuseLight(vec3 torchPos, float distanceFactor) {
    vec3 torchLightVec= torchPos - vPosition;
    float torchIntensity = max(0.0, torchMaxIntensity - (length(torchLightVec) * distanceFactor));
    return torchLightColor * max (dot(vNormal, normalize(torchLightVec)), 0.1) * torchIntensity * torchIntensity;
}

void main() {
    vec3 torchLight = vec3(0,0,0);
    for (int i = 0; i < 2; i++) {
        vec3 torchPos = lightList[i];
        torchLight += diffuseLight(torchPos, 0.25);
    }
    vec3 sunLight = directionalLight();
    vec3 light = ambientLightColor + sunLight + torchLight;

    vec2 wrappedTextureCoord = vPosition.xy;

    vec3 grassColor = texture2D(grassSampler, wrappedTextureCoord * 0.5).xyz;
    vec3 grassColor2 = texture2D(grassSampler, wrappedTextureCoord * 0.4).xyz;
    vec3 soilColor = texture2D(soilSampler, wrappedTextureCoord * 0.5).xyz;
    float noiseValue1 = texture2D(noiseSampler, wrappedTextureCoord * 0.05).x;
    float noiseValue2 = texture2D(noiseSampler, vPosition.yx * 0.25).x;
    float grassStepValue = smoothstep(0.0, 0.8, noiseValue1);
    float soilStepValue = smoothstep(0.05, 0.25, noiseValue1 + noiseValue2 * 0.25);

    vec3 mixedGrassColor = mix(grassColor, grassColor2, grassStepValue) * light;
    vec4 outputColor = vec4(mix(soilColor, mixedGrassColor, soilStepValue) * light, 1);

    // TODO: use normals shader
    if (viewNormals) {
        gl_FragColor = vec4(vNormal * 0.5 + vec3(0.5, 0.5, 0.5), 1);
    } else {
        gl_FragColor = outputColor;
    }
}
