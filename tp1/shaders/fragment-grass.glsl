precision mediump float;

uniform sampler2D grassSampler;
uniform sampler2D soilSampler;
uniform sampler2D noiseSampler;
uniform bool viewNormals;

varying vec3 vPosition;
varying vec3 vNormal;
varying vec4 vColor;

void main() {
    vec3 outputColor;
    vec2 wrappedTextureCoord = vPosition.xy;

    vec3 grassColor = texture2D(grassSampler, wrappedTextureCoord * 0.5).xyz;
    vec3 grassColor2 = texture2D(grassSampler, wrappedTextureCoord * 0.2).xyz;
    vec3 soilColor = texture2D(soilSampler, wrappedTextureCoord * 0.5).xyz;
    float noiseValue1 = texture2D(noiseSampler, wrappedTextureCoord * 0.05).x;
    float noiseValue2 = texture2D(noiseSampler, vPosition.yx * 0.25).x;
    float soilStepValue = smoothstep(0.25, 0.4, noiseValue1);
    float grassStepValue = smoothstep(0.25, 0.4, noiseValue1 + noiseValue2 * 0.25);

    vec3 soiledGrassColor = mix(grassColor, grassColor2, soilStepValue);

    // TODO: use normals shader
    if (viewNormals) {
        gl_FragColor = vec4(vNormal * 0.5 + vec3(0.5, 0.5, 0.5), 1);
    } else {
        //gl_FragColor = vec4(mix(grassColor, soiledGrassColor, grassStepValue), 1);
        gl_FragColor = vec4(soiledGrassColor, 1);
    }
}
