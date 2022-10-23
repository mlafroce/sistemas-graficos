// fragment shaders don't have a default precision so we need to pick one
precision mediump float;

varying vec3 vNormal;
varying vec3 vPosWorld;

varying vec4 colorPos;

void main() {
    //vec3 lightVec=normalize(vec3(0.0,3.0,5.0)-vPosWorld);
    //vec3 diffColor=mix(vec3(0.7,0.7,0.7),vNormal,0.4);
    //vec3 color=dot(lightVec,vNormal)*diffColor+vec3(0.2,0.2,0.2);

    //gl_FragColor = vec4(color,1.0);
    gl_FragColor = vec4(colorPos.xyz, 1);
}
