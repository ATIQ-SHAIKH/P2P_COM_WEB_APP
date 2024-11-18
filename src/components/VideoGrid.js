export default function VideoGrid({ participants, userStream, peerStreams }) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 h-full">
        {/* Display user's video */}
        {userStream && (
          <div
            className="bg-gray-800 flex items-center justify-center text-white rounded-md aspect-video"
          >
            <video
              className="w-full h-full object-cover"
              autoPlay
              muted
              playsInline
              ref={(video) => {
                if (video && userStream) {
                  video.srcObject = userStream;
                }
              }}
            />
            <span className="absolute bottom-2 left-2 text-sm text-white">You</span>
          </div>
        )}
  
        {/* Display other participants' videos */}
        {peerStreams.map((stream, index) => (
          <div
            key={index}
            className="bg-gray-800 flex items-center justify-center text-white rounded-md aspect-video"
          >
            <video
              className="w-full h-full object-cover"
              autoPlay
              playsInline
              ref={(video) => {
                if (video) {
                  video.srcObject = userStream;
                //   video.srcObject = stream;
                }
              }}
            />
            <span className="absolute bottom-2 left-2 text-sm text-white">
              User {index + 1}
            </span>
          </div>
        ))}
      </div>
    );
  }
  