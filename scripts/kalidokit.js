import * as THREE from 'three';

import { Face, Utils, Vector } from 'kalidokit';
const remap = Utils.remap;
const clamp = Utils.clamp;
const lerp = Vector.lerp;

function rigRotation(bone,
                     rotation = { x: 0, y: 0, z: 0 },
                     dampener = 1,
                     lerpAmount = 0.3) {
    let euler = new THREE.Euler(
        -rotation.x * dampener,
        rotation.y * dampener,
        -rotation.z * dampener
    );
    let quaternion = new THREE.Quaternion().setFromEuler(euler);
    bone.quaternion.slerp(quaternion, lerpAmount);
}

export function rigFace(riggedFace, neckBone, morphTargets, morphDict) {
    // head turn
    rigRotation(neckBone, riggedFace.head, 0.7);

    // eyes
    if (morphTargets) {        
        morphTargets[morphDict["Blink_Left"]] = lerp(clamp(1 - riggedFace.eye.l, 0, 1), morphTargets[morphDict["Blink_Left"]], .5)
        morphTargets[morphDict["Blink_Right"]] = lerp(clamp(1 - riggedFace.eye.r, 0, 1), morphTargets[morphDict["Blink_Right"]], .5)
    }
}