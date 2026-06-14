import { useEffect } from "react";
import { useStore } from "../store/StoreContext";

export default function Notification() {
  const { state, dispatch } = useStore();
  const { notification } = state.ui;

  useEffect(() => {
    if (!notification) return;
    const t = setTimeout(() => dispatch({ type: "CLEAR_NOTIFICATION" }), 3500);
    return () => clearTimeout(t);
  }, [notification, dispatch]);

  if (!notification) return null;

  return (
    <div className={`fs-toast ${notification.type}`}>
      <span>{notification.type === "success" ? "✓" : "✕"}</span>
      <span>{notification.msg}</span>
    </div>
  );
}
