import { FaMicrophone, FaVideo, FaPhoneSlash, FaComments, FaDesktop } from "react-icons/fa";

export default function ControlsBar() {
  return (
    <div className="bg-gray-900 p-4 flex justify-center space-x-6 fixed bottom-0 w-full">
      <button className="bg-gray-700 p-3 rounded-full hover:bg-gray-600">
        <FaMicrophone className="text-white" />
      </button>
      <button className="bg-gray-700 p-3 rounded-full hover:bg-gray-600">
        <FaVideo className="text-white" />
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
