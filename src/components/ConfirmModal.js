import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TouchableWithoutFeedback,
  Platform,
} from 'react-native';
import { Colors } from '../theme/colors';

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

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(10, 5, 12, 0.78)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalCard: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: Colors.surfaceElevated,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: 22,
    paddingTop: 24,
    paddingBottom: 20,
    alignItems: 'center',
    ...Platform.select({
      web: {
        boxShadow: '0 16px 40px rgba(0, 0, 0, 0.55)',
      },
      default: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.45,
        shadowRadius: 18,
        elevation: 12,
      },
    }),
  },
  iconBadge: {
    width: 46,
    height: 46,
    borderRadius: 23,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    marginBottom: 14,
  },
  iconBadgeDestructive: {
    backgroundColor: 'rgba(255, 107, 107, 0.14)',
    borderColor: 'rgba(255, 107, 107, 0.35)',
  },
  iconBadgeDefault: {
    backgroundColor: 'rgba(200, 70, 99, 0.14)',
    borderColor: 'rgba(200, 70, 99, 0.35)',
  },
  iconText: {
    fontSize: 18,
    fontWeight: '800',
  },
  iconTextDestructive: {
    color: Colors.error,
  },
  iconTextDefault: {
    color: Colors.primary,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.textPrimary,
    textAlign: 'center',
    marginBottom: 8,
  },
  message: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 22,
    paddingHorizontal: 6,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  cancelBtn: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    paddingVertical: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelBtnText: {
    color: Colors.textSecondary,
    fontSize: 14,
    fontWeight: '700',
  },
  confirmBtn: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmBtnFullWidth: {
    flex: 1,
  },
  confirmBtnDestructive: {
    backgroundColor: Colors.error,
  },
  confirmBtnDefault: {
    backgroundColor: Colors.primary,
  },
  confirmBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
});

