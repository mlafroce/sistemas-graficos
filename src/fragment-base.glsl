// fragment shaders don't have a default precision so we need to pick one
precision mediump float;

varying vec3 vPosition;
varying vec3 vNormal;
varying vec4 vColor;

void main() {
    vec3 lightVec= normalize(vec3(0.0, -10.0, 10.0) - vPosition);
    vec3 lightColor = vec3(1, 1, 1) * max (dot(vNormal,lightVec), 0.0);
    vec3 outputColor= mix(vColor.xyz, lightColor, 0.2);

    vec3 normalColor = vNormal * 0.5 + vec3(0.5, 0.5, 0.5);
    //gl_FragColor = vec4(normalColor, 1.0);
    gl_FragColor = vec4(outputColor, vColor.w);
}
