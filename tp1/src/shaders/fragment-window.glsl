// fragment shaders don't have a default precision so we need to pick one
precision mediump float;

uniform bool viewNormals;    // bool activa normales
uniform mat2 textureMatrix;  // matriz de corrección de normales
uniform vec4 modelColor;     // color default
uniform int nTextures;     // cantidad de texturas disponibles
uniform sampler2D uSampler;
uniform vec3 lightList[3];
uniform vec3 ambientLightColor;
uniform vec3 sunLightColor;
uniform vec3 torchLightColor;
uniform vec3 eyePos;
uniform vec3 sunLightPos;
uniform float shininess;
uniform float reflectionCoef;

varying vec3 vPosition;
varying vec3 vNormal;
varying vec2 vTextureCoord;

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

vec3 reflectionLight(vec3 torchPos) {
    vec3 lightVec= normalize(torchPos - vPosition);
    vec3 reflectionNormal = 2.0 * max(dot(lightVec, vNormal), 0.0) * vNormal - lightVec;
    vec3 eyeVec = normalize(eyePos - vPosition);
    float torchDistance = length(torchPos - vPosition);
    float materialReflection = (1.2 - texture2D(uSampler, vTextureCoord).a) * 5.0;
    float reflection = max(dot(reflectionNormal, eyeVec), 0.0) * materialReflection;
    float reflectionIntensity = pow(reflection, shininess) * reflectionCoef;
    return torchLightColor * reflectionIntensity / max(torchDistance, 1.0);
}

void main() {
    vec3 torchLight = vec3(0,0,0);
    for (int i = 0; i < 3; i++) {
        vec3 torchPos = lightList[i];
        torchLight += diffuseLight(torchPos, 0.25);
        torchLight += reflectionLight(torchPos) / 2.0;
    }
    vec3 sunLight = directionalLight();
    vec3 light = ambientLightColor + sunLight + torchLight;

    vec4 outputColor;
    if (nTextures > 0 ) {
        vec2 wrappedTextureCoord = textureMatrix * vTextureCoord;
        vec4 textureColor = texture2D(uSampler, wrappedTextureCoord).rgba;
        outputColor = vec4(light * textureColor.rgb, max(textureColor.a, length(light)));
    } else {
        outputColor = vec4(light * modelColor.rgb, 1);
    }
    // TODO: use normals shader
    if (viewNormals) {
        gl_FragColor = vec4(vNormal * 0.5 + vec3(0.5, 0.5, 0.5), modelColor.a);
    } else {
        gl_FragColor = outputColor;
    }
}
