import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useEffect } from "react";
import { hideNotification } from "@/redux/NotificationSlice";
import { BiSolidError } from "react-icons/bi";
import { IoClose, IoCloseCircleSharp } from "react-icons/io5";
import { FaCheck } from "react-icons/fa";

const Notification = () => {
  const dispatch = useDispatch();
  const { message, type, visible } = useSelector(
    (state: RootState) => state.notification,
  );

  useEffect(() => {
    if (visible) {
      const timer = setTimeout(() => {
        dispatch(hideNotification());
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [visible, dispatch]);

  return (
    <div
      className={`fixed z-[1000] top-4 right-4 flex items-center gap-2 w-80 px-4 py-2 rounded-lg font-semibold text-lg transition-transform duration-300 ${
        visible
          ? "translate-y-0 opacity-100 pointer-events-auto"
          : "translate-x-10 opacity-0 pointer-events-none"
      } ${
        type === "success"
          ? "bg-green-400 text-neutral-100"
          : type === "error"
            ? "bg-red-400 text-neutral-100"
            : "bg-yellow-400 text-neutral-900"
      }`}
    >
      {type === "error" ? (
        <IoCloseCircleSharp className="text-xl" />
      ) : type === "success" ? (
        <FaCheck className="text-2xl" />
      ) : (
        <BiSolidError className="text-xl" />
      )}
      <span>{message}</span>
      <div
        onClick={() => dispatch(hideNotification())}
        className="cursor-pointer active:scale-90 duration-300 ml-auto"
      >
        <IoClose className="text-2xl" />
      </div>
    </div>
  );
};

export default Notification;
