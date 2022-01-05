#pragma glslify: noiseFunc = require(glsl-noise/simplex/4d);

uniform float uTime;
uniform float uTimeScaleVert;
uniform float uNoiseScaleVert;
uniform float uDisplacementScale;
varying vec3 vNormal;

void main() {
  float displacement = noiseFunc(vec4(normal * uNoiseScaleVert, uTime * uTimeScaleVert)) * uDisplacementScale;
  vec3 newPosition = position + (normal * displacement);
  gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
  vNormal = normal;
}