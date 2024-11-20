"use client";

import { useEffect, useState } from "react";
import VideoGrid from "../../components/VideoGrid";
import ControlsBar from "../../components/ControlsBar";

export default function Meet() {
  const [participants, setParticipants] = useState(["You"]);
  const [userStream, setUserStream] = useState(null);
  const [peerStreams, setPeerStreams] = useState([]);
  const [localPeerConnection, setLocalPeerConnection] = useState(null);

  const [micOn, setMicOn] = useState(true); // State for mic status
  const [videoOn, setVideoOn] = useState(true); // State for video status

  // Capture user's video and audio
  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({
        video: true,
        audio: true,
      })
      .then((stream) => {
        setUserStream(stream);
        console.log("Got MediaStream:", stream);

        // Initialize WebRTC peer connection for this user
        const peerConnection = new RTCPeerConnection();

        // Add user's stream to the connection
        stream.getTracks().forEach((track) => {
          peerConnection.addTrack(track, stream);
        });

        setLocalPeerConnection(peerConnection);
      })
      .catch((error) => {
        console.error("Error accessing media devices.", error);
      });

    // Cleanup media stream when component unmounts
    return () => {
      if (userStream) {
        userStream.getTracks().forEach((track) => track.stop());
      }
      if (localPeerConnection) {
        localPeerConnection.close();
      }
    };
  }, []);

  // Function to toggle mic
  const toggleMic = () => {
    if (userStream) {
      const audioTrack = userStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setMicOn(audioTrack.enabled);
      }
    }
  };

  // Function to toggle video
  const toggleVideo = () => {
    if (userStream) {
      const videoTrack = userStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setVideoOn(videoTrack.enabled);
      }
    }
  };

  return (
    <div className="h-screen bg-gray-900 text-white flex flex-col">
      <div className="flex-grow overflow-hidden">
        <VideoGrid
          participants={participants}
          userStream={userStream}
          peerStreams={peerStreams}
        />
      </div>
      <ControlsBar micOn={micOn} videoOn={videoOn} onToggleMic={toggleMic} onToggleVideo={toggleVideo} />
    </div>
  );
}
