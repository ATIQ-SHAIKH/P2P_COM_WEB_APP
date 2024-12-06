"use client";

import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import VideoGrid from "../../../components/VideoGrid";
import ControlsBar from "../../../components/ControlsBar";
import SidePanel from "../../../components/SidePanel";
import { usePathname } from "next/navigation";

export default function Meet() {
  const pathname = usePathname();

  const [participants, setParticipants] = useState(["You"]);
  const [userStream, setUserStream] = useState(null);
  const [peerConnections, setPeerConnections] = useState({});
  const [peerStreams, setPeerStreams] = useState([]);
  const [micOn, setMicOn] = useState(true);
  const [videoOn, setVideoOn] = useState(true);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [socket, setSocket] = useState(null);
  const [meetCode, setMeetCode] = useState(null);

  // Extract meetCode from pathname
  useEffect(() => {
    const pathParts = pathname.split("/");
    const code = pathParts[pathParts.length - 1];
    setMeetCode(code);
  }, [pathname]);

  // Initialize socket connection and media stream
  useEffect(() => {
    const newSocket = io("http://localhost:9999");
    setSocket(newSocket);

    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        setUserStream(stream);

        // Emit join event with meetCode
        newSocket.emit("join-meet", meetCode);

        // Update participants list with self
        setParticipants((prev) => [...prev, `User: ${newSocket.id}`]);

        // Handle new participant
        newSocket.on("new-participant", async ({ participantId }) => {
          const peerConnection = createPeerConnection(newSocket, participantId);

          stream.getTracks().forEach((track) => {
            peerConnection.addTrack(track, stream);
          });

          const offer = await peerConnection.createOffer();
          await peerConnection.setLocalDescription(offer);

          newSocket.emit("offer", {
            meetCode,
            offer,
            recipient: participantId,
          });

          setPeerConnections((prev) => ({
            ...prev,
            [participantId]: peerConnection,
          }));

          // Add new participant to the list
          setParticipants((prev) => [...prev, `User: ${participantId}`]);
        });

        // Handle incoming offer
        newSocket.on("offer", async ({ offer, sender }) => {
          const peerConnection = createPeerConnection(newSocket, sender);
          await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));

          const answer = await peerConnection.createAnswer();
          await peerConnection.setLocalDescription(answer);

          newSocket.emit("answer", { meetCode, answer, recipient: sender });

          setPeerConnections((prev) => ({
            ...prev,
            [sender]: peerConnection,
          }));
        });

        // Handle incoming answer
        newSocket.on("answer", async ({ answer, sender }) => {
          const peerConnection = peerConnections[sender];
          if (peerConnection) {
            await peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
          }
        });

        // Handle incoming ICE candidate
        newSocket.on("candidate", async ({ candidate, sender }) => {
          const peerConnection = peerConnections[sender];
          if (peerConnection) {
            await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
          }
        });

        // Handle participant leaving
        newSocket.on("participant-left", ({ participantId }) => {
          if (peerConnections[participantId]) {
            peerConnections[participantId].close();
            setPeerConnections((prev) => {
              const updatedConnections = { ...prev };
              delete updatedConnections[participantId];
              return updatedConnections;
            });

            // Remove participant from the list
            setParticipants((prev) => prev.filter((p) => p !== `User: ${participantId}`));
          }
        });
      })
      .catch((error) => {
        console.error("Error accessing media devices.", error);
      });

    return () => {
      if (userStream) userStream.getTracks().forEach((track) => track.stop());
      Object.values(peerConnections).forEach((peerConnection) => peerConnection.close());
      newSocket.close();
    };
  }, [meetCode]);

  const createPeerConnection = (socket, participantId) => {
    const peerConnection = new RTCPeerConnection();

    peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit("candidate", { meetCode, candidate: event.candidate, recipient: participantId });
      }
    };

    peerConnection.ontrack = (event) => {
      const stream = event.streams[0];

      // Add the stream to peer streams and update participants
      setPeerStreams((prev) => [...prev, stream]);
      setParticipants((prev) => {
        const participantName = `User: ${participantId}`;
        return prev.includes(participantName) ? prev : [...prev, participantName];
      });
    };

    return peerConnection;
  };

  const toggleMic = () => {
    if (userStream) {
      const audioTrack = userStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setMicOn(audioTrack.enabled);
      }
    }
  };

  const toggleVideo = () => {
    if (userStream) {
      const videoTrack = userStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setVideoOn(videoTrack.enabled);
      }
    }
  };

  // Handle sending a message
  const sendMessage = () => {
    if (newMessage.trim() === "") return;

    const message = { sender: "You", text: newMessage, timestamp: new Date() };
    setMessages((prev) => [...prev, message]);
    setNewMessage(""); // Clear input

    // Send message to peers via WebRTC signaling (placeholder logic)
    console.log("Message sent:", message);
  };

  // Toggle side panel
  const togglePanel = () => {
    setIsPanelOpen((prev) => !prev);
    console.log(isPanelOpen)
  };

  return (
    <div className="h-screen bg-gray-900 text-white flex flex-col relative">
      <div>{meetCode}</div>
      <div className="flex-grow overflow-hidden">
        <VideoGrid participants={participants} userStream={userStream} peerStreams={peerStreams} />
        {isPanelOpen && (
          <SidePanel
            messages={messages}
            newMessage={newMessage}
            setNewMessage={setNewMessage}
            sendMessage={sendMessage}
            closePanel={togglePanel}
          />
        )}
      </div>
      <ControlsBar micOn={micOn} videoOn={videoOn} onToggleMic={toggleMic} onToggleVideo={toggleVideo} onTogglePanel={togglePanel} />
    </div>
  );
}
