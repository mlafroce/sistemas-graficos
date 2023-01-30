precision mediump float;

uniform sampler2D grassSampler;
uniform sampler2D soilSampler;
uniform sampler2D noiseSampler;
uniform bool viewNormals;

varying vec3 vPosition;
varying vec3 vNormal;
varying vec4 vColor;

const vec3 torchPos = vec3(1, -2.0, 1.0);
const vec3 ambientLightVec = vec3(0.4, 0.4, 0.4);
const float torchMaxIntensity = 0.8;
const vec3 torchLightColor = vec3(1, 0.95, 0.8);
const vec3 directionalLightColor = vec3(1.0, 1.0, 1.0);
const vec3 directionalLightSource = vec3(0.0, -100.0, 100.0);

vec3 directionalLight(vec3 lightPos, vec3 color) {
    vec3 lightVec= normalize(lightPos - vPosition);
    return color * max (dot(vNormal, lightVec), 0.0);
}

vec3 diffuseLight(vec3 torchPos, vec3 torchColor, float distanceFactor) {
    vec3 torchLightVec= torchPos - vPosition;
    float torchIntensity = max(0.0, torchMaxIntensity - length(torchLightVec) * distanceFactor);
    return torchColor * max (dot(vNormal, normalize(torchLightVec)), 0.0) * torchIntensity;
}

void main() {
    vec3 torchLight = diffuseLight(torchPos, torchLightColor, 0.25);
    vec3 sunLight = directionalLight(directionalLightSource, directionalLightColor);
    vec3 light = ambientLightVec + torchLight + sunLight;

    vec2 wrappedTextureCoord = vPosition.xy;

    vec3 grassColor = texture2D(grassSampler, wrappedTextureCoord * 0.5).xyz;
    vec3 soilColor = texture2D(soilSampler, wrappedTextureCoord * 0.5).xyz;
    float noiseValue1 = texture2D(noiseSampler, wrappedTextureCoord * 0.05).x;
    float noiseValue2 = texture2D(noiseSampler, vPosition.yx * 0.25).x;
    float stepValue = smoothstep(0.25, 0.4, noiseValue1 + noiseValue2 * 0.25);

    vec4 outputColor = vec4(mix(soilColor, grassColor, stepValue) * light, 1);

    // TODO: use normals shader
    if (viewNormals) {
        gl_FragColor = vec4(vNormal * 0.5 + vec3(0.5, 0.5, 0.5), 1);
    } else {
        gl_FragColor = outputColor;
    }
}
