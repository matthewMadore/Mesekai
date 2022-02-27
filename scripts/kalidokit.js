import * as THREE from 'three';

import { Face, Utils, Vector } from 'kalidokit';
const remap = Utils.remap;
const clamp = Utils.clamp;
const lerp = Vector.lerp;

function rigPosition(bone,
                     position = { x: 0, y: 0, z: 0 },
                     dampener = 1,
                     lerpAmount = 0.3) {
    let vector = new THREE.Vector3(
      position.x * dampener,
      position.y * dampener,
      position.z * dampener
    );
    bone.position.lerp(vector, lerpAmount);
};

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

export function rigPose(riggedPose, bones) {
    // bones: 0.hipBone, 1.botSpineBone, 2.midSpineBone, 3.topSpineBone
    //        4.rShoulderBone, 5.rElbowBone, 6.lShoulderBone, 7.lElbowBone, 
    //        8.rHipBone, 9.rKneeBone, 10.lHipBone, 11.lKneeBone

    rigRotation(bones[0], riggedPose.Hips.rotation, 0.7);
    // rigPosition(
    //     bones[0],
    //     {
    //       x: -riggedPose.Hips.position.x, // Reverse direction
    //       y: riggedPose.Hips.position.y + 1, // Add a bit of height
    //       z: -riggedPose.Hips.position.z // Reverse direction
    //     },
    //     1,
    //     0.07
    // );

    rigRotation(bones[1], riggedPose.Spine, 0.45, .3);
    rigRotation(bones[2], riggedPose.Spine, 0.25, .3);
    rigRotation(bones[2], riggedPose.Spine, 0.15, .3);

    rigRotation(bones[6], riggedPose.RightUpperArm, 1, .3);
    rigRotation(bones[7], riggedPose.RightLowerArm, 1, .3);
    rigRotation(bones[4], riggedPose.LeftUpperArm, 1, .3);
    rigRotation(bones[5], riggedPose.LeftLowerArm, 1, .3);

    rigRotation(bones[10], riggedPose.RightUpperLeg, 1, .3);
    rigRotation(bones[11], riggedPose.RightLowerLeg, 1, .3);
    rigRotation(bones[8], riggedPose.LeftUpperLeg, 1, .3);
    rigRotation(bones[9], riggedPose.LeftLowerLeg, 1, .3);
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