import * as THREE from 'three';

import { Face, Utils, Vector } from 'kalidokit';
const remap = Utils.remap;
const clamp = Utils.clamp;
const lerp = Vector.lerp;

let poseRig = null;

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
                     negate = { x : false, y : false, z : false },
                     dampener = 1,
                     lerpAmount = 0.3) {
    let euler = new THREE.Euler(
        (negate.x) ? -rotation.x * dampener : rotation.x * dampener,
        (negate.y) ? -rotation.y * dampener : rotation.y * dampener,
        (negate.z) ? -rotation.z * dampener : rotation.z * dampener
    );
    let quaternion = new THREE.Quaternion().setFromEuler(euler);
    bone.quaternion.slerp(quaternion, lerpAmount);
}

export function rigPose(riggedPose, bones) {
    // bones: 0.hipBone, 1.botSpineBone, 2.midSpineBone, 3.topSpineBone
    //        4.rShoulderBone, 5.rElbowBone, 6.lShoulderBone, 7.lElbowBone, 
    //        8.rHipBone, 9.rKneeBone, 10.lHipBone, 11.lKneeBone

    poseRig = riggedPose;   // save for rigHand()

    // TODO: movement
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

    let negate = {x : true, y : false, z : true};

    // BODY
    rigRotation(bones[0], riggedPose.Hips.rotation, 0.7);
    rigRotation(bones[1], riggedPose.Spine, negate, 0.45, .3);
    rigRotation(bones[2], riggedPose.Spine, negate, 0.25, .3);
    rigRotation(bones[2], riggedPose.Spine, negate, 0.15, .3);

    // ARMS
    rigRotation(bones[6], riggedPose.RightUpperArm, negate, 1, .3);
    rigRotation(bones[7], riggedPose.RightLowerArm, negate, 1, .3);
    rigRotation(bones[4], riggedPose.LeftUpperArm, negate, 1, .3);
    rigRotation(bones[5], riggedPose.LeftLowerArm, negate, 1, .3);

    // LEGS
    rigRotation(bones[10], riggedPose.RightUpperLeg, negate, 1, .3);
    rigRotation(bones[11], riggedPose.RightLowerLeg, negate, 1, .3);
    rigRotation(bones[8], riggedPose.LeftUpperLeg, negate, 1, .3);
    rigRotation(bones[9], riggedPose.LeftLowerLeg, negate, 1, .3);
}

export function rigHand(riggedHand, hand="Left", bones) {
    // WRIST
    let negate = {x : false, y : false, z : false};

    rigRotation(bones[0], {
        // combine pose rotation Z and hand rotation X Y
        z: (poseRig) ? ((hand == "Left") ? poseRig.LeftHand.z : poseRig.RightHand.z) : 0,
        y: (hand == "Left") ? riggedHand.LeftWrist.y : riggedHand.RightWrist.y,
        x: (hand == "Left") ? riggedHand.LeftWrist.x : riggedHand.RightWrist.x
    }, negate);

    // THUMB
    negate = {x : false, y : true, z : false};

    rigRotation(bones[1], (hand == "Left") ? riggedHand.LeftThumbProximal : riggedHand.RightThumbProximal, negate);
    rigRotation(bones[2], (hand == "Left") ? riggedHand.LeftThumbIntermediate : riggedHand.RightThumbIntermediate, negate);
    rigRotation(bones[3], (hand == "Left") ? riggedHand.LeftThumbDistal : riggedHand.RightThumbDistal, negate);

    // FINGERS
    negate = {x : true, y : false, z : false};

    rigRotation(bones[13], (hand == "Left") ? riggedHand.LeftRingProximal : riggedHand.RightRingProximal, negate);
    rigRotation(bones[14], (hand == "Left") ? riggedHand.LeftRingIntermediate : riggedHand.RightRingIntermediate, negate);
    rigRotation(bones[15], (hand == "Left") ? riggedHand.LeftRingDistal : riggedHand.RightRingDistal, negate);
    rigRotation(bones[5], (hand == "Left") ? riggedHand.LeftIndexProximal : riggedHand.RightIndexProximal, negate);
    rigRotation(bones[6], (hand == "Left") ? riggedHand.LeftIndexIntermediate : riggedHand.RightIndexIntermediate, negate);
    rigRotation(bones[7], (hand == "Left") ? riggedHand.LeftIndexDistal : riggedHand.RightIndexDistal, negate);
    rigRotation(bones[9], (hand == "Left") ? riggedHand.LeftMiddleProximal : riggedHand.RightMiddleProximal, negate);
    rigRotation(bones[10], (hand == "Left") ? riggedHand.LeftMiddleIntermediate : riggedHand.RightMiddleIntermediate, negate);
    rigRotation(bones[11], (hand == "Left") ? riggedHand.LeftMiddleDistal : riggedHand.RightMiddleDistal, negate);
    rigRotation(bones[17], (hand == "Left") ? riggedHand.LeftLittleProximal : riggedHand.RightLittleProximal, negate);
    rigRotation(bones[18], (hand == "Left") ? riggedHand.LeftLittleIntermediate : riggedHand.RightLittleIntermediate, negate);
    rigRotation(bones[19], (hand == "Left") ? riggedHand.LeftLittleDistal : riggedHand.RightLittleDistal, negate);
}

export function rigFace(riggedFace, neckBone, morphTargets, morphDict) {
    // HEAD
    let negate = {x : true, y : false, z : true};
    rigRotation(neckBone, riggedFace.head, negate, 0.7);

    // EYES       
    morphTargets[morphDict["Blink_Left"]] = lerp(clamp(1 - riggedFace.eye.l, 0, 1), morphTargets[morphDict["Blink_Left"]], .5)
    morphTargets[morphDict["Blink_Right"]] = lerp(clamp(1 - riggedFace.eye.r, 0, 1), morphTargets[morphDict["Blink_Right"]], .5)

    // TODO: MOUTH
}