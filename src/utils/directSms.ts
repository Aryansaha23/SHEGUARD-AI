import { NativeModules, PermissionsAndroid, Platform } from "react-native";

type DirectSmsModuleType = {
  sendSms: (phoneNumber: string, message: string) => Promise<boolean>;
};

const { DirectSmsModule } = NativeModules as {
  DirectSmsModule?: DirectSmsModuleType;
};

export async function requestSmsPermission(): Promise<boolean> {
  if (Platform.OS !== "android") {
    return false;
  }

  try {
    const alreadyGranted = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.SEND_SMS
    );

    if (alreadyGranted) {
      return true;
    }

    const result = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.SEND_SMS,
      {
        title: "SHEGUARD AI SMS Permission",
        message:
          "SHEGUARD AI needs permission to send emergency SOS SMS directly to your trusted contacts.",
        buttonPositive: "Allow",
        buttonNegative: "Deny",
      }
    );

    return result === PermissionsAndroid.RESULTS.GRANTED;
  } catch (error) {
    console.error("SMS Permission Error:", error);
    return false;
  }
}

export async function sendDirectSms(
  phoneNumber: string,
  message: string
): Promise<boolean> {
  if (Platform.OS !== "android") {
    throw new Error("Direct SMS is currently supported on Android only.");
  }

  if (!DirectSmsModule) {
    throw new Error(
      "DirectSmsModule is not available. Please rebuild the Android app."
    );
  }

  if (!phoneNumber || !phoneNumber.trim()) {
    throw new Error("Phone number is required.");
  }

  if (!message || !message.trim()) {
    throw new Error("SMS message is required.");
  }

  return DirectSmsModule.sendSms(
    phoneNumber.trim(),
    message.trim()
  );
}