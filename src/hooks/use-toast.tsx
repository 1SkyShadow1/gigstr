
// Simpler implementation that doesn't rely on jotai
import * as React from "react";
import {
  type ToastActionElement,
} from "@/components/ui/toast";

// Define types
export type ToasterToast = {
  id: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: ToastActionElement;
  variant?: "default" | "destructive";
  duration?: number;
  open?: boolean;
};

type ToastState = {
  toasts: ToasterToast[];
};

// ACTION TYPES
const TOAST_ADD = "TOAST_ADD";
const TOAST_UPDATE = "TOAST_UPDATE";
const TOAST_DISMISS = "TOAST_DISMISS";
const TOAST_REMOVE = "TOAST_REMOVE";

type ToastAction =
  | { type: typeof TOAST_ADD; toast: ToasterToast }
  | { type: typeof TOAST_UPDATE; toast: Partial<ToasterToast> & { id: string } }
  | { type: typeof TOAST_DISMISS; toastId: string }
  | { type: typeof TOAST_REMOVE; toastId: string };

const toastReducer = (state: ToastState, action: ToastAction): ToastState => {
  switch (action.type) {
    case TOAST_ADD:
      return {
        ...state,
        toasts: [...state.toasts, action.toast],
      };
    case TOAST_UPDATE:
      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === action.toast.id ? { ...t, ...action.toast } : t
        ),
      };
    case TOAST_DISMISS:
      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === action.toastId ? { ...t, open: false } : t
        ),
      };
    case TOAST_REMOVE:
      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== action.toastId),
      };
    default:
      return state;
  }
};

// Constants
const DEFAULT_TOAST_DURATION = 5000; // 5 seconds
const TOAST_REMOVE_DELAY = 1000; // 1 second after dismiss

// Create a context to hold the toast state and dispatch
const ToastContext = React.createContext<{
  toasts: ToasterToast[];
  addToast: (toast: Omit<ToasterToast, "id">) => void;
  updateToast: (toast: Partial<ToasterToast> & { id: string }) => void;
  dismissToast: (id: string) => void;
  removeToast: (id: string) => void;
} | null>(null);

// Create a provider component
export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = React.useReducer(toastReducer, {
    toasts: [],
  });

  // Generate a unique id
  const generateId = () => {
    return Math.random().toString(36).substring(2, 9);
  };

  const addToast = React.useCallback(
    (toast: Omit<ToasterToast, "id">) => {
      const id = generateId();
      const newToast = {
        id,
        ...toast,
        open: true,
        duration: toast.duration || DEFAULT_TOAST_DURATION,
      };

      dispatch({ type: TOAST_ADD, toast: newToast });
    },
    []
  );

  const updateToast = React.useCallback(
    (toast: Partial<ToasterToast> & { id: string }) => {
      dispatch({ type: TOAST_UPDATE, toast });
    },
    []
  );

  const dismissToast = React.useCallback((id: string) => {
    dispatch({ type: TOAST_DISMISS, toastId: id });
  }, []);

  const removeToast = React.useCallback((id: string) => {
    dispatch({ type: TOAST_REMOVE, toastId: id });
  }, []);

  // Auto-dismiss and auto-remove toasts
  React.useEffect(() => {
    const dismissTimeouts: Record<string, NodeJS.Timeout> = {};
    const removeTimeouts: Record<string, NodeJS.Timeout> = {};

    state.toasts.forEach((toast) => {
      if (!dismissTimeouts[toast.id] && toast.duration !== Infinity) {
        dismissTimeouts[toast.id] = setTimeout(() => {
          dismissToast(toast.id);
          
          // Set a timeout to remove the toast
          if (!removeTimeouts[toast.id]) {
            removeTimeouts[toast.id] = setTimeout(() => {
              removeToast(toast.id);
              delete removeTimeouts[toast.id];
            }, TOAST_REMOVE_DELAY);
          }
          
          delete dismissTimeouts[toast.id];
        }, toast.duration || DEFAULT_TOAST_DURATION);
      }
    });

    // Cleanup function
    return () => {
      Object.values(dismissTimeouts).forEach(clearTimeout);
      Object.values(removeTimeouts).forEach(clearTimeout);
    };
  }, [dismissToast, removeToast, state.toasts]);

  return (
    <ToastContext.Provider
      value={{
        toasts: state.toasts,
        addToast,
        updateToast,
        dismissToast,
        removeToast,
      }}
    >
      {children}
    </ToastContext.Provider>
  );
};

// Create a hook to use the toast context
// eslint-disable-next-line react-refresh/only-export-components
export const useToast = () => {
  const context = React.useContext(ToastContext);
  
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  
  const toast = (props: Omit<ToasterToast, "id">) => {
    context.addToast(props);
  };
  
  return {
    toast,
    toasts: context.toasts,
    dismiss: context.dismissToast,
    update: context.updateToast,
  };
};

// Export a standalone toast function for direct usage in components
// Prefer using the useToast hook to access toast actions within provider scope
