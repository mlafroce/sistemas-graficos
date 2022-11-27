precision mediump float;

varying vec3 vPosition;

void main() {
    float red = 1.0 - abs(vPosition.y);
    float greenBlue = 0.8 * red - abs(vPosition.x);
    float alpha = 1.0 - (abs(vPosition.x) + abs(vPosition.y));
    gl_FragColor = vec4(red, greenBlue, greenBlue * 0.5, alpha);
}
