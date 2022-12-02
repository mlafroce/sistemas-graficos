precision mediump float;

uniform sampler2D noise1Sampler;
uniform sampler2D noise2Sampler;
uniform bool viewNormals;
uniform vec4 modelColor;     // color default
uniform float clockTick;

varying vec3 vPosition;
varying vec3 vNormal;
varying vec4 vColor;

void main() {
    vec3 outputColor;

    float noiseValue1 = texture2D(noise1Sampler, vPosition.yx * 0.2).x * 0.4 + 0.5;
    float noiseValue2 = texture2D(noise2Sampler, vPosition.yx * 0.1).x * 0.3 + 0.5;
    float mixValue = sin(clockTick / 40.0) * 0.5 + 0.5;
    float currentNoise = mix(noiseValue1, noiseValue2, mixValue);

    // TODO: use normals shader
    if (viewNormals) {
        gl_FragColor = vec4(vNormal * 0.5 + vec3(0.5, 0.5, 0.5), 1);
    } else {
        gl_FragColor = vec4(modelColor.xyz * currentNoise , modelColor.a);
    }
}
