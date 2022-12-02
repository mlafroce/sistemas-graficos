// fragment shaders don't have a default precision so we need to pick one
precision mediump float;

varying vec3 vNormal;

void main() {
    gl_FragColor = vec4(vNormal * 0.5 + vec3(0.5, 0.5, 0.5), 1.0);
}
