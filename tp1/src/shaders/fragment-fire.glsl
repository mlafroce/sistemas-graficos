// Inspired on https://clockworkchilli.com/blog/8_a_fire_shader_in_glsl_for_your_webgl_games
precision mediump float;

varying vec2 vTextureCoord;
uniform sampler2D fireSampler;
uniform float clockTick;

void main() {
    vec2 colorCoord = vec2(vTextureCoord.x * 2.0 + (clockTick / 100.0), vTextureCoord.y * 2.0 - clockTick / 41.0);
    vec2 maskCoord = vec2(vTextureCoord.x * 1.5 - (clockTick / 100.0), vTextureCoord.y * 2.0 - clockTick / 37.0);

    vec4 fireColor = texture2D(fireSampler, colorCoord);
    float flameShape = texture2D(fireSampler, vTextureCoord).a;

    vec3 fireRed = vec3(1.0, 0.4, 0.1) * clamp(0.5 + fireColor.r, 0.0, 1.0);
    vec3 fireOrange = vec3(1.0, 0.6, 0.3) * fireColor.r * fireColor.g;
    float mask = max(texture2D(fireSampler, maskCoord).b, fireColor.b);

    gl_FragColor = vec4(max(fireRed, fireOrange), flameShape * mask);
    //gl_FragColor = vec4(1, 0.5, 0.5, 1);
}
