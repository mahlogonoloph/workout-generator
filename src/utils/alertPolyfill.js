import { Platform, Alert } from 'react-native';

/**
 * Polyfills React Native Web's empty `Alert.alert` stub so that any direct
 * `Alert.alert(...)` calls in web deployments display interactive confirmation/alert
 * prompts and invoke the appropriate callbacks (`onPress`).
 */
if (Platform.OS === 'web' && typeof window !== 'undefined') {
  Alert.alert = (title, message, buttons, options) => {
    const formattedMessage = [title, message].filter(Boolean).join('\n\n');

    if (!buttons || buttons.length === 0) {
      window.alert(formattedMessage);
      return;
    }

    if (buttons.length === 1) {
      window.alert(formattedMessage);
      buttons[0]?.onPress?.();
      return;
    }

    // Two or more buttons -> confirm dialog
    const confirmed = window.confirm(formattedMessage);
    if (confirmed) {
      const confirmBtn =
        buttons.find((b) => b.style === 'destructive') ||
        buttons.find((b) => b.style !== 'cancel') ||
        buttons[buttons.length - 1];
      confirmBtn?.onPress?.();
    } else {
      const cancelBtn = buttons.find((b) => b.style === 'cancel');
      cancelBtn?.onPress?.();
    }
  };
}

