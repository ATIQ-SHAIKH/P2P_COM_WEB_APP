// "use client";

// import { useEffect, useState, useRef } from "react";
// import { io } from "socket.io-client";
// import VideoGrid from "../../../components/VideoGrid";
// import ControlsBar from "../../../components/ControlsBar";
// import SidePanel from "../../../components/SidePanel";
// import { usePathname } from "next/navigation";

// export default function Meet() {
//   const pathname = usePathname();

//   const [participants, setParticipants] = useState([]);
//   const [userStream, setUserStream] = useState(null);
//   const [peerConnections, setPeerConnections] = useState({});
//   const [peerStreams, setPeerStreams] = useState([]);
//   const [micOn, setMicOn] = useState(true);
//   const [videoOn, setVideoOn] = useState(true);
//   const [isPanelOpen, setIsPanelOpen] = useState(false);
//   const [messages, setMessages] = useState([]);
//   const [newMessage, setNewMessage] = useState("");
//   const [socket, setSocket] = useState(null);
//   const [meetCode, setMeetCode] = useState(null);

//   const peerConnectionsRef = useRef({});
//   useEffect(() => {
//     peerConnectionsRef.current = peerConnections;
//   }, [peerConnections]);

//   // Extract meetCode from pathname
//   useEffect(() => {
//     const pathParts = pathname.split("/");
//     const code = pathParts[pathParts.length - 1];
//     setMeetCode(code);
//   }, [pathname]);

//   // Initialize socket connection and media stream
//   useEffect(() => {
//     const newSocket = io("http://localhost:9999");
//     setSocket(newSocket);

//     navigator.mediaDevices
//       .getUserMedia({ video: true, audio: true })
//       .then((stream) => {
//         setUserStream(stream);

//         // Emit join event with meetCode
//         newSocket.emit("join-meet", meetCode);

//         // Update participants list with self
//         setParticipants((prev) => [...prev, `User: ${newSocket.id}`]);

//         // Handle new participant
//         newSocket.on("new-participant", async ({ participantId }) => {
//           const peerConnection = createPeerConnection(newSocket, participantId);

//           stream.getTracks().forEach((track) => {
//             peerConnection.addTrack(track, stream);
//           });

//           const offer = await peerConnection.createOffer();
//           await peerConnection.setLocalDescription(offer);

//           newSocket.emit("offer", {
//             meetCode,
//             offer,
//             recipient: participantId,
//           });

//           setPeerConnections((prev) => ({
//             ...prev,
//             [participantId]: peerConnection,
//           }));

//           // Add new participant to the list
//           setParticipants((prev) => [...prev, `User: ${participantId}`]);
//         });

//         // Handle incoming offer
//         newSocket.on("offer", async ({ offer, sender }) => {
//           setPeerConnections((prev) => {
//             if (!prev[sender]) {
//               const peerConnection = createPeerConnection(newSocket, sender);
//               peerConnection.setRemoteDescription(new RTCSessionDescription(offer)).then(async () => {
//                 const answer = await peerConnection.createAnswer();
//                 await peerConnection.setLocalDescription(answer);

//                 newSocket.emit("answer", { meetCode, answer, recipient: sender });
//               });

//               return { ...prev, [sender]: peerConnection };
//             }
//             return prev;
//           });
//         });


//         // Handle incoming answer
//         newSocket.on("answer", async ({ answer, sender }) => {
//           const peerConnection = peerConnections[sender];
//           if (peerConnection) {
//             await peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
//           }
//         });

//         // Handle incoming ICE candidate
//         newSocket.on("candidate", async ({ candidate, sender }) => {
//           const peerConnection = peerConnections[sender];
//           if (peerConnection) {
//             await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
//           }
//         });

//         // Handle participant leaving
//         newSocket.on("participant-left", ({ participantId }) => {
//           setPeerConnections((prev) => {
//             const { [participantId]: leavingConnection, ...remainingConnections } = prev;
//             leavingConnection?.close();
//             return remainingConnections;
//           });

//           setParticipants((prev) => prev.filter((p) => !p.includes(participantId)));
//           setPeerStreams((prev) => prev.filter((stream) => stream.participantId !== participantId)); // Assuming you store `participantId` in the stream
//         });

//       })
//       .catch((error) => {
//         console.error("Error accessing media devices.", error);
//       });

//     // Cleanup logic
//     return () => {
//       if (userStream) userStream.getTracks().forEach((track) => track.stop());
//       Object.values(peerConnectionsRef.current).forEach((peerConnection) => peerConnection.close());
//       newSocket.close();
//     };
//   }, [meetCode]);

//   const createPeerConnection = (socket, participantId) => {
//     const peerConnection = new RTCPeerConnection();

//     peerConnection.onicecandidate = (event) => {
//       if (event.candidate) {
//         socket.emit("candidate", { meetCode, candidate: event.candidate, recipient: participantId });
//       }
//     };
    
//     peerConnection.onicecandidateerror = (event) => {
//       console.error("ICE candidate error:", event.errorText);
//     };
    

//     peerConnection.ontrack = (event) => {
//       const stream = event.streams[0];
//       setPeerStreams((prev) => {
//         if (prev.find((s) => s.id === stream.id)) return prev; // Avoid duplicates
//         return [...prev, stream];
//       });
//     };


//     return peerConnection;
//   };

//   const toggleMic = () => {
//     if (userStream) {
//       const audioTrack = userStream.getAudioTracks()[0];
//       if (audioTrack) {
//         audioTrack.enabled = !audioTrack.enabled;
//         setMicOn(audioTrack.enabled);
//       }
//     }
//   };

//   const toggleVideo = () => {
//     if (userStream) {
//       const videoTrack = userStream.getVideoTracks()[0];
//       if (videoTrack) {
//         videoTrack.enabled = !videoTrack.enabled;
//         setVideoOn(videoTrack.enabled);
//       }
//     }
//   };

//   // Handle sending a message
//   const sendMessage = () => {
//     if (newMessage.trim() === "") return;

//     const message = { sender: "You", text: newMessage, timestamp: new Date() };
//     setMessages((prev) => [...prev, message]);
//     setNewMessage(""); // Clear input

//     // Send message to peers via WebRTC signaling (placeholder logic)
//     console.log("Message sent:", message);
//   };

//   // Toggle side panel
//   const togglePanel = () => {
//     setIsPanelOpen((prev) => !prev);
//     console.log(isPanelOpen)
//   };

//   return (
//     <div className="h-screen bg-gray-900 text-white flex flex-col relative">
//       <div>{meetCode}</div>
//       <div className="flex-grow overflow-hidden">
//         <VideoGrid participants={participants} userStream={userStream} peerStreams={peerStreams} />
//         {isPanelOpen && (
//           <SidePanel
//             messages={messages}
//             newMessage={newMessage}
//             setNewMessage={setNewMessage}
//             sendMessage={sendMessage}
//             closePanel={togglePanel}
//           />
//         )}
//       </div>
//       <ControlsBar micOn={micOn} videoOn={videoOn} onToggleMic={toggleMic} onToggleVideo={toggleVideo} onTogglePanel={togglePanel} />
//     </div>
//   );
// }
