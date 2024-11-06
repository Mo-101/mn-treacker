import { loadGetUserSnapshotEventListener } from "./get-user-snapshot";
import { loadReportUrlChangeEventListener } from "./report-url-change";
import { loadReportErrorEventListener } from "./report-error";

export const initializeEventListeners = () => {
  // Check if the script is running in an iframe
  if (window.top !== window.self) {
    loadGetUserSnapshotEventListener();
    loadReportUrlChangeEventListener();
    loadReportErrorEventListener();
  }
};