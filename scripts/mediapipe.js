import { Camera } from "@mediapipe/camera_utils";
import { Holistic } from "@mediapipe/holistic";

import { setPose, setFingers, setMorphs, kalidoFace, kalidoPose, kalidoHand } from "./avatar";

// device constants
const WIDTH = 1920;
const HEIGHT = 1080;

export function PoseDetector(preload, videoInput, kalidokit=false) {
    const holistic = new Holistic({locateFile: (file) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/holistic/${file}`;
    }});

    holistic.setOptions({
        modelComplexity: 1,
        smoothLandmarks: true,
        refineFaceLandmarks: true,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5
    });

    holistic.onResults((results) => {
        preload.hidden = true;

        let poseLandmarks = results.poseLandmarks;
        let poseWorldLandmarks = results.ea;
        if (poseLandmarks && poseWorldLandmarks) {
            if (kalidokit) kalidoPose(poseLandmarks, poseWorldLandmarks);
            else setPose(poseLandmarks, poseWorldLandmarks);
        }
    
        let leftHandLandmarks = results.leftHandLandmarks;
        if (leftHandLandmarks) {
            if (kalidokit) kalidoHand(leftHandLandmarks, "Left");
            else setFingers(leftHandLandmarks, false);
        }
    
        let rightHandLandmarks = results.rightHandLandmarks;
        if (rightHandLandmarks) {
            if (kalidokit) kalidoHand(rightHandLandmarks, "Right");
            else setFingers(rightHandLandmarks, true);
        }

        let faceLandmarks = results.faceLandmarks;
        if (faceLandmarks) {
            if (kalidokit) kalidoFace(faceLandmarks);
            else setMorphs(faceLandmarks);
        }
    });

    const camera = new Camera(videoInput, {
        onFrame: async () => {
            await holistic.send({image: videoInput});
        },
        width: WIDTH,
        height: HEIGHT
    });

    return [holistic, camera];
}