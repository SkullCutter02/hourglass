export async function requestPermission(): Promise<boolean> {
  if (Notification.permission === "granted") {
    return true;
  } else if (Notification.permission === "denied") {
    return false;
  } else {
    const permission = await Notification.requestPermission();
    return permission === "granted";
  }
}
