"use client";

import { useEffect, useRef, useState, useCallback } from 'react';
import { usePathname , useRouter} from 'next/navigation';
// import useSocket from '@/app/hooks/socket';
import { io } from 'socket.io-client';
import ControlsBar from '@/components/ControlsBar';
import SidePanel from '@/components/SidePanel';

const Meet = () => {
    // useSocket();
    const router = useRouter();

    const pathname = usePathname();
    const pathParts = pathname.split("/");
    const roomId = pathParts[pathParts.length - 1];

    const userVideoRef = useRef();
    const peerVideoRef = useRef();
    const rtcConnectionRef = useRef(null);
    const socketRef = useRef();
    const userStreamRef = useRef();
    const hostRef = useRef(false);

    const [micOn, setMicOn] = useState(true);
    const [videoOn, setVideoOn] = useState(true);
    const [isPanelOpen, setIsPanelOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");

    useEffect(useCallback(() => {
        socketRef.current = io(`${process.env.WEBSOCKET_URL}`);
        // First we join a room
        socketRef.current.emit('join', roomId);

        socketRef.current.on('created', handleRoomCreated);

        socketRef.current.on('joined', handleRoomJoined);
        // If the room didn't exist, the server would emit the room was 'created'

        // Whenever the next person joins, the server emits 'ready'
        socketRef.current.on('ready', initiateCall);

        // Emitted when a peer leaves the room
        socketRef.current.on('leave', onPeerLeave);

        // If the room is full, we show an alert
        socketRef.current.on('full', () => {
            window.location.href = '/';
        });

        // Events that are webRTC speccific
        socketRef.current.on('offer', handleReceivedOffer);
        socketRef.current.on('answer', handleAnswer);
        socketRef.current.on('ice-candidate', handlerNewIceCandidateMsg);

        // clear up after
        return () => socketRef.current.disconnect();
    }, [roomId]));

    const handleRoomCreated = () => {
        hostRef.current = true;
        navigator.mediaDevices
            .getUserMedia({
                audio: true,
                video: { width: 500, height: 500 },
            })
            .then((stream) => {
                /* use the stream */
                userStreamRef.current = stream;
                userVideoRef.current.srcObject = stream;
                userVideoRef.current.onloadedmetadata = () => {
                    userVideoRef.current.play();
                };
            })
            .catch((err) => {
                /* handle the error */
                console.log(err);
            });
    };

    const handleRoomJoined = () => {
        navigator.mediaDevices
            .getUserMedia({
                audio: true,
                video: { width: 500, height: 500 },
            })
            .then((stream) => {
                /* use the stream */
                userStreamRef.current = stream;
                userVideoRef.current.srcObject = stream;
                userVideoRef.current.onloadedmetadata = () => {
                    userVideoRef.current.play();
                };
                socketRef.current.emit('ready', roomId);
            })
            .catch((err) => {
                /* handle the error */
                console.log('error', err);
            });
    };

    const initiateCall = () => {
        if (hostRef.current) {
            rtcConnectionRef.current = createPeerConnection();
            rtcConnectionRef.current.addTrack(
                userStreamRef.current.getTracks()[0],
                userStreamRef.current,
            );
            rtcConnectionRef.current.addTrack(
                userStreamRef.current.getTracks()[1],
                userStreamRef.current,
            );
            rtcConnectionRef.current
                .createOffer()
                .then((offer) => {
                    rtcConnectionRef.current.setLocalDescription(offer);
                    socketRef.current.emit('offer', offer, roomId);
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    };

    const ICE_SERVERS = {
        iceServers: [
            {
                urls: 'stun:openrelay.metered.ca:80',
            }
        ],
    };

    const createPeerConnection = () => {
        // We create a RTC Peer Connection
        const connection = new RTCPeerConnection(ICE_SERVERS);

        // We implement our onicecandidate method for when we received a ICE candidate from the STUN server
        connection.onicecandidate = handleICECandidateEvent;

        // We implement our onTrack method for when we receive tracks
        connection.ontrack = handleTrackEvent;
        return connection;

    };

    const handleReceivedOffer = (offer) => {
        if (!hostRef.current) {
            rtcConnectionRef.current = createPeerConnection();
            rtcConnectionRef.current.addTrack(
                userStreamRef.current.getTracks()[0],
                userStreamRef.current,
            );
            rtcConnectionRef.current.addTrack(
                userStreamRef.current.getTracks()[1],
                userStreamRef.current,
            );
            rtcConnectionRef.current.setRemoteDescription(offer);

            rtcConnectionRef.current
                .createAnswer()
                .then((answer) => {
                    rtcConnectionRef.current.setLocalDescription(answer);
                    socketRef.current.emit('answer', answer, roomId);
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    };

    const handleAnswer = (answer) => {
        rtcConnectionRef.current
            .setRemoteDescription(answer)
            .catch((err) => console.log(err));
    };

    const handleICECandidateEvent = (event) => {
        if (event.candidate) {
            socketRef.current.emit('ice-candidate', event.candidate, roomId);
        }
    };

    const handlerNewIceCandidateMsg = (incoming) => {
        // We cast the incoming candidate to RTCIceCandidate
        const candidate = new RTCIceCandidate(incoming);
        rtcConnectionRef.current
            .addIceCandidate(candidate)
            .catch((e) => console.log(e));
    };

    const handleTrackEvent = (event) => {
        peerVideoRef.current.srcObject = event.streams[0];
    };

    const leaveRoom = () => {
        socketRef.current.emit('leave', roomId); // Let's the server know that user has left the room.

        if (userVideoRef.current.srcObject) {
            userVideoRef.current.srcObject.getTracks().forEach((track) => track.stop()); // Stops receiving all track of User.
        }
        if (peerVideoRef.current.srcObject) {
            peerVideoRef.current.srcObject
                .getTracks()
                .forEach((track) => track.stop()); // Stops receiving audio track of Peer.
        }

        // Checks if there is peer on the other side and safely closes the existing connection established with the peer.
        if (rtcConnectionRef.current) {
            rtcConnectionRef.current.ontrack = null;
            rtcConnectionRef.current.onicecandidate = null;
            rtcConnectionRef.current.close();
            rtcConnectionRef.current = null;
        }
        router.push('/')
    };

    const onPeerLeave = () => {
        // This person is now the creator because they are the only person in the room.
        hostRef.current = true;
        if (peerVideoRef.current.srcObject) {
            peerVideoRef.current.srcObject
                .getTracks()
                .forEach((track) => track.stop()); // Stops receiving all track of Peer.
        }

        // Safely closes the existing connection established with the peer who left.
        if (rtcConnectionRef.current) {
            rtcConnectionRef.current.ontrack = null;
            rtcConnectionRef.current.onicecandidate = null;
            rtcConnectionRef.current.close();
            rtcConnectionRef.current = null;
        }
    }

    const toggleMic = () => {
        if (userVideoRef.current) {
            const audioTrack = userVideoRef.current.srcObject.getAudioTracks()[0];
            if (audioTrack) {
                audioTrack.enabled = !audioTrack.enabled;
                setMicOn(audioTrack.enabled);
            }
        }
    };

    const toggleVideo = () => {
        if (userVideoRef.current) {
            const videoTrack = userVideoRef.current.srcObject.getVideoTracks()[0];
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
            <h1>Room: {roomId}-{socketRef.current?.id || "connecting..."}</h1>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 p-4">
                <video autoPlay muted ref={userVideoRef} style={{ width: '300px', border: '1px solid black' }} />
                <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-sm p-2">
                    You
                </div>
                <video autoPlay ref={peerVideoRef} style={{ width: '300px', border: '1px solid black' }} />
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
            <ControlsBar micOn={micOn} videoOn={videoOn} onToggleMic={toggleMic} onToggleVideo={toggleVideo} onTogglePanel={togglePanel} onEndCall={leaveRoom} />
        </div>
    );
};

export default Meet;
