export default function VideoGrid({ participants, userStream, peerStreams }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 h-full">
      {/* Display videos for all participants */}
      {participants.map((participant, index) => {
        const isUser = index === 0; // First participant is always "You"
        const stream = isUser ? userStream : peerStreams[index - 1];

        return (
          <div
            key={participant}
            className="bg-gray-800 flex items-center justify-center text-white rounded-md aspect-video"
          >
            {stream ? (
              <video
                className="w-full h-full object-cover rounded"
                autoPlay
                muted={isUser} // Mute the user's video to avoid feedback
                playsInline
                ref={(video) => {
                  if (video) {
                    video.srcObject = userStream;
                  }
                }}
              />
            ) : (
              <div className="text-center">Waiting for {participant}...</div>
            )}
            <span className="absolute bottom-2 left-2 text-sm text-white">
              {participant}
            </span>
          </div>
        );
      })}
    </div>
  );
}
