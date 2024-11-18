"use client";

import { useEffect, useState } from "react";
import VideoGrid from "../../components/VideoGrid";
import ControlsBar from "../../components/ControlsBar";

export default function Meet() {
  const [participants, setParticipants] = useState(["You"]); // Initially, only the user
  const [userStream, setUserStream] = useState(null);
  const [peerStreams, setPeerStreams] = useState([]);
  const [localPeerConnection, setLocalPeerConnection] = useState(null);

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

  // Function to handle incoming peer stream (other participants)
  const handleNewPeerStream = (peerStream) => {
    setPeerStreams((prevStreams) => [...prevStreams, peerStream]);
    setParticipants((prevParticipants) => [
      ...prevParticipants,
      `User ${peerStreams.length + 1}`,
    ]);
  };

  // Listen for incoming peer connection and add streams
  useEffect(() => {
    if (localPeerConnection) {
      localPeerConnection.ontrack = (event) => {
        handleNewPeerStream(event.streams[0]);
      };
    }
  }, [localPeerConnection]);

  // Once other users join, they will initiate a connection (This is simplified, adjust for your signaling)
  useEffect(() => {
    // For simplicity, we simulate new participant joining every 5 seconds
    const interval = setInterval(() => {
      handleNewPeerStream(new MediaStream()); // Add a fake stream for now
    }, 5000); // Simulate a new user joining every 5 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-screen bg-gray-900 text-white flex flex-col">
      {/* Displaying the user's video */}
      <div className="flex-grow overflow-hidden">
        <VideoGrid
          participants={participants}
          userStream={userStream}
          peerStreams={peerStreams}
        />
      </div>
      <ControlsBar />
    </div>
  );
}
