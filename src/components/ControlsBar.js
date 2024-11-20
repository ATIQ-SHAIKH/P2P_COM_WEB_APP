import { FaMicrophone, FaVideo, FaPhoneSlash, FaComments, FaDesktop, FaMicrophoneSlash, FaVideoSlash } from "react-icons/fa";

export default function ControlsBar({ micOn, videoOn, onToggleMic, onToggleVideo }) {
  return (
    <div className="bg-gray-900 p-4 flex justify-center space-x-6 fixed bottom-0 w-full">
      <button className="bg-gray-700 p-3 rounded-full hover:bg-gray-600" onClick={onToggleMic}>
        {micOn ? (<FaMicrophone className="text-white" />) : (< FaMicrophoneSlash className="text-white" />)}
      </button>
      <button className="bg-gray-700 p-3 rounded-full hover:bg-gray-600" onClick={onToggleVideo}>
        {videoOn ? (<FaVideo className="text-white" />) : (<FaVideoSlash className="text-white" />)}
      </button>
      <button className="bg-red-700 p-3 rounded-full hover:bg-red-600">
        <FaPhoneSlash className="text-white" />
      </button>
      <button className="bg-gray-700 p-3 rounded-full hover:bg-gray-600">
        <FaComments className="text-white" />
      </button>
      <button className="bg-gray-700 p-3 rounded-full hover:bg-gray-600">
        <FaDesktop className="text-white" />
      </button>
    </div>
  );
}

// export default function ControlsBar({ micOn, videoOn, onToggleMic, onToggleVideo }) {
//   return (
//     <div className="bg-gray-800 py-4 flex justify-center items-center space-x-4">
//       {/* Mic Toggle Button */}
//       <button
//         className={`p-2 rounded-full ${micOn ? "bg-green-500" : "bg-red-500"}`}
//         onClick={onToggleMic}
//       >
//         {micOn ? (
//           <svg
//             xmlns="http://www.w3.org/2000/svg"
//             className="h-6 w-6 text-white"
//             fill="none"
//             viewBox="0 0 24 24"
//             stroke="currentColor"
//           >
//             <path
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               strokeWidth={2}
//               d="M12 11c1.656 0 3-1.344 3-3V5c0-1.656-1.344-3-3-3S9 3.344 9 5v3c0 1.656 1.344 3 3 3z"
//             />
//           </svg>
//         ) : (
//           <svg
//             xmlns="http://www.w3.org/2000/svg"
//             className="h-6 w-6 text-white"
//             fill="none"
//             viewBox="0 0 24 24"
//             stroke="currentColor"
//           >
//             <path
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               strokeWidth={2}
//               d="M15 9l6 6M9 15L3 9m0 0h6m-6 6h6"
//             />
//           </svg>
//         )}
//       </button>

//       {/* Video Toggle Button */}
//       <button
//         className={`p-2 rounded-full ${videoOn ? "bg-green-500" : "bg-red-500"}`}
//         onClick={onToggleVideo}
//       >
//         {videoOn ? (
//           <svg
//             xmlns="http://www.w3.org/2000/svg"
//             className="h-6 w-6 text-white"
//             fill="none"
//             viewBox="0 0 24 24"
//             stroke="currentColor"
//           >
//             <path
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               strokeWidth={2}
//               d="M15 10l4.5-4.5M4 9v6c0 .841.454 1.368 1.006 1.743a1.964 1.964 0 001.994.044L13 13"
//             />
//           </svg>
//         ) : (
//           <svg
//             xmlns="http://www.w3.org/2000/svg"
//             className="h-6 w-6 text-white"
//             fill="none"
//             viewBox="0 0 24 24"
//             stroke="currentColor"
//           >
//             <path
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               strokeWidth={2}
//               d="M3 10l1.5 1.5M8 12.5l2.5 2.5M10 5v6m0 0H4m6 0h6"
//             />
//           </svg>
//         )}
//       </button>
//     </div>
//   );
// }
