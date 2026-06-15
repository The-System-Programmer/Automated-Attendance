import { useRef, useState } from "react";

function VideoRecorder() {
    const videoRef = useRef(null);
    const mediaRecorderRef = useRef(null);
    const chunksRef = useRef([]);

    const [recording, setRecording] = useState(false);

    const startRecording = async () => {
        try {const stream = await navigator.mediaDevices.getUserMedia({video: true,audio: false});

            videoRef.current.srcObject = stream;
            const recorder = new MediaRecorder(stream);
            recorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    chunksRef.current.push(event.data);
                }
            };

            mediaRecorderRef.current = recorder;
            recorder.start();

            setRecording(true);
        }
        catch (error) {
            console.error("Camera error:", error);
        }
    };

    const stopRecording = () => {
        mediaRecorderRef.current.onstop = async () => {
            const blob = new Blob(
                chunksRef.current,
                { type: "video/webm" }
            );

            console.log("Blob size:", blob.size);

            const formData = new FormData();

            formData.append(
                "video",
                blob,
                "attendance.webm"
            );

            try {
                const response = await fetch(
                    "/attendance",
                    {
                        method: "POST",
                        body: formData
                    }
                );

                const data = await response.json();

                console.log("Upload successful:", data);
            }
            catch (error) {
                console.error("Upload failed:", error);
            }

            chunksRef.current = [];
        };

        mediaRecorderRef.current.stop();
        setRecording(false);
    };

    return (
        <div>
            <h2>Video Attendance Recorder</h2>

            <video
                ref={videoRef}
                autoPlay
                muted
                playsInline
                width="600"
            />

            <br />

            {!recording ? (
                <button onClick={startRecording}>
                    Start Recording
                </button>
            ) : (
                <button onClick={stopRecording}>
                    Stop Recording
                </button>
            )}
        </div>
    );
}

export default VideoRecorder; 