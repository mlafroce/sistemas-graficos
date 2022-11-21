precision mediump float;

varying vec3 vPosition;
varying vec3 vNormal;
varying vec4 vColor;

void main() {
    vec3 outputColor;
    // gl_FragColor = vNormal * 0.5 + vec3(0.5, 0.5, 0.5);
    gl_FragColor = vec4(0.4, 0.8, 0.3, 0.9);
}
