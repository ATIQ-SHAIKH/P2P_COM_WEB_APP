import React, { useRef, useEffect } from "react";

function VideoGrid({ participants, userStream, peerStreams }) {
  const userVideoRef = useRef(null);

  // Attach the user's media stream to their video element
  useEffect(() => {
    if (userVideoRef.current && userStream) {
      userVideoRef.current.srcObject = userStream;
    }
  }, [userStream]);

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 p-4">
      {/* Local User Video */}
      {userStream && (
        <div className="video-tile border border-gray-600 rounded-lg overflow-hidden relative">
          <video
            ref={userVideoRef}
            autoPlay
            muted
            playsInline
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-sm p-2">
            You
          </div>
        </div>
      )}

      {/* Other Participants' Videos */}
      {peerStreams.map((stream, index) => (
        <div
          key={index}
          className="video-tile border border-gray-600 rounded-lg overflow-hidden relative"
        >
          <video
            autoPlay
            playsInline
            className="w-full h-full object-cover"
            ref={(videoElement) => {
              if (videoElement) {
                videoElement.srcObject = stream.getVideoTracks()[0];;
              }
            }}
          />
          <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-sm p-2">
            {participants[index + 1] || "Participant"}
          </div>
        </div>
      ))}
    </div>
  );
}

export default VideoGrid;
