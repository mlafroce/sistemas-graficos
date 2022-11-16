// fragment shaders don't have a default precision so we need to pick one
precision mediump float;

varying vec3 vNormal;
varying vec4 vColor;

varying vec4 colorPos;
varying vec4 modelColor;

void main() {
    vec3 lightVec= normalize((0.0,10.0,10.0) - vec3(colorPos));
    //vec3 lightVec=normalize(vec3(0.0,3.0,5.0)-vPosWorld);
    //vec3 diffColor=mix(vec3(0.7,0.7,0.7),vNormal,0.4);
    vec3 lightColor = dot(lightVec,vNormal)*vec3(0.5, 0.5, 0.5);
    vec3 color= mix(vColor.xyz, lightColor, 0.5) + vec3(0.2,0.2,0.2);
    //vec3 color = diffColor;

    //vec3 color = colorPos.xyz * max (dot(vNormal,lightVec), 0.0);
    vec3 normalColor = vNormal * 0.5 + vec3(0.5, 0.5, 0.5);
    //gl_FragColor = vec4(colorPos.xyz, 1);
    //gl_FragColor = vec4(normalColor, 1.0);
    gl_FragColor = vec4(color, 1.0);
}
