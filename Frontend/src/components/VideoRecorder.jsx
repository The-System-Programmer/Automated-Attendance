import { useRef, useState } from "react";

function VideoRecorder() {
    const videoRef = useRef(null);
    const mediaRecorderRef = useRef(null);
    const streamRef = useRef(null);
    const chunksRef = useRef([]);

    const [recording, setRecording] = useState(false);

    const startRecording = async () => {
        try {
            let stream;

            try {
                // Prefer rear camera
                stream = await navigator.mediaDevices.getUserMedia({
                    video: {
                        facingMode: { exact: "environment" },
                        width: { ideal: 1280 },
                        height: { ideal: 720 },
                        frameRate: { ideal: 24, max: 30 }
                    },
                    audio: false
                });
            } catch {
                // Fallback
                stream = await navigator.mediaDevices.getUserMedia({
                    video: {
                        facingMode: { ideal: "environment" },
                        width: { ideal: 1280 },
                        height: { ideal: 720 }
                    },
                    audio: false
                });
            }

            streamRef.current = stream;

            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }

            chunksRef.current = [];

            const recorder = new MediaRecorder(stream, {
                mimeType: MediaRecorder.isTypeSupported(
                    "video/webm;codecs=vp8"
                )
                    ? "video/webm;codecs=vp8"
                    : "video/webm"
            });

            recorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    chunksRef.current.push(event.data);
                }
            };

            recorder.start();

            mediaRecorderRef.current = recorder;
            setRecording(true);
        } catch (error) {
            console.error("Camera error:", error);
            alert("Unable to access camera.");
        }
    };

    const stopRecording = () => {
        if (!mediaRecorderRef.current) return;

        mediaRecorderRef.current.onstop = async () => {
            const blob = new Blob(chunksRef.current, {
                type: "video/webm"
            });

            console.log("Blob size:", blob.size);

            const formData = new FormData();
            formData.append(
                "video",
                blob,
                "attendance.webm"
            );

            try {
                const response = await fetch("/attendance", {
                    method: "POST",
                    body: formData
                });

                const data = await response.json();

                console.log(
                    "Upload successful:",
                    data
                );
            } catch (error) {
                console.error(
                    "Upload failed:",
                    error
                );
            }

            // Stop all camera tracks
            if (streamRef.current) {
                streamRef.current
                    .getTracks()
                    .forEach((track) => track.stop());

                streamRef.current = null;
            }

            if (videoRef.current) {
                videoRef.current.srcObject = null;
            }

            chunksRef.current = [];
        };

        mediaRecorderRef.current.stop();
        setRecording(false);
    };

    return (
        <div
            style={{
                padding: "16px",
                textAlign: "center"
            }}
        >
            <h2>Video Attendance Recorder</h2>

            <video
                ref={videoRef}
                autoPlay
                muted
                playsInline
                style={{
                    width: "100%",
                    maxWidth: "400px",
                    borderRadius: "12px",
                    background: "#000"
                }}
            />

            <div style={{ marginTop: "16px" }}>
                {!recording ? (
                    <button
                        onClick={startRecording}
                        style={{
                            padding: "12px 24px"
                        }}
                    >
                        Start Recording
                    </button>
                ) : (
                    <button
                        onClick={stopRecording}
                        style={{
                            padding: "12px 24px"
                        }}
                    >
                        Stop Recording
                    </button>
                )}
            </div>
        </div>
    );
}

export default VideoRecorder;