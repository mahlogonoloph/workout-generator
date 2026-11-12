import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Platform,
} from 'react-native';
import { Colors } from '../theme/colors';
import styles from './ConfirmModal.styles';

/**
 * Cross-platform confirmation and alert modal.
 * Works seamlessly across Web, iOS, and Android without relying on native Alert.alert stubs.
 */
export default function ConfirmModal({
  visible,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  isDestructive = false,
  icon,
  onConfirm,
  onCancel,
}) {
  if (!visible) return null;

  const defaultIcon = isDestructive ? '✕' : 'ℹ';
  const displayIcon = icon || defaultIcon;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <TouchableWithoutFeedback onPress={onCancel}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={styles.modalCard}>
              {/* Header Icon Badge */}
              <View
                style={[
                  styles.iconBadge,
                  isDestructive ? styles.iconBadgeDestructive : styles.iconBadgeDefault,
                ]}
              >
                <Text
                  style={[
                    styles.iconText,
                    isDestructive ? styles.iconTextDestructive : styles.iconTextDefault,
                  ]}
                >
                  {displayIcon}
                </Text>
              </View>

              {/* Title & Message */}
              {title ? <Text style={styles.title}>{title}</Text> : null}
              {message ? <Text style={styles.message}>{message}</Text> : null}

              {/* Action Buttons */}
              <View style={styles.actionsRow}>
                {cancelText ? (
                  <TouchableOpacity
                    style={styles.cancelBtn}
                    activeOpacity={0.75}
                    onPress={onCancel}
                    accessibilityRole="button"
                    accessibilityLabel={cancelText}
                  >
                    <Text style={styles.cancelBtnText}>{cancelText}</Text>
                  </TouchableOpacity>
                ) : null}

                <TouchableOpacity
                  style={[
                    styles.confirmBtn,
                    isDestructive ? styles.confirmBtnDestructive : styles.confirmBtnDefault,
                    !cancelText && styles.confirmBtnFullWidth,
                  ]}
                  activeOpacity={0.8}
                  onPress={onConfirm}
                  accessibilityRole="button"
                  accessibilityLabel={confirmText}
                >
                  <Text style={styles.confirmBtnText}>{confirmText}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

