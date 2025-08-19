import { reactive } from "vue";

export type ToastType =
    | "success"
    | "info"
    | "warning"
    | "danger"
    | "error" // Alias zu danger
    | "fuchsia"
    | "slate"
    | "lime"
    | "red"
    | "orange"
    | "cyan"
    | "gray"
    | "dark";

export type ToastPosition =
    | "top-left"
    | "top-center"
    | "top-right"
    | "bottom-left"
    | "bottom-center"
    | "bottom-right"
    | "center"
    | "center-left"
    | "center-right";

export interface ToastOptions {
    key?: string; // stabiler Schlüssel zum Updaten
    message: string;
    type?: ToastType;
    duration?: number; // ms
    position?: ToastPosition;
}

export interface Toast extends Required<Omit<ToastOptions, "key">> {
    id: number;
    key?: string;
}

const defaultOptions: Required<Omit<ToastOptions, "message" | "key">> = {
    type: "info",
    duration: 3000,
    position: "top-right",
};

const toasts = reactive<Toast[]>([]);
const timers = new Map<number, ReturnType<typeof setTimeout>>();
const keyMap = new Map<string, number>();
let seed = 0;

export function useToast() {
    function normalizeType(t: ToastType): Exclude<ToastType, "error"> {
        return t === "error" ? "danger" : t; // error → danger
    }

    function showToast(opts: ToastOptions) {
        // Update per key
        if (opts.key && keyMap.has(opts.key)) {
            const id = keyMap.get(opts.key)!;
            const idx = toasts.findIndex((t) => t.id === id);
            if (idx !== -1) {
                const t = toasts[idx];
                t.message = opts.message;
                t.type = normalizeType(opts.type ?? defaultOptions.type);
                t.duration = opts.duration ?? defaultOptions.duration;
                t.position = opts.position ?? defaultOptions.position;

                clearTimeout(timers.get(id));
                const handle = setTimeout(() => removeToast(id), t.duration);
                timers.set(id, handle);
                return;
            }
        }

        // Neu anlegen
        const toast: Toast = {
            id: ++seed,
            key: opts.key,
            message: opts.message,
            type: normalizeType(opts.type ?? defaultOptions.type),
            duration: opts.duration ?? defaultOptions.duration,
            position: opts.position ?? defaultOptions.position,
        };

        toasts.push(toast);
        if (opts.key) keyMap.set(opts.key, toast.id);

        const handle = setTimeout(() => removeToast(toast.id), toast.duration);
        timers.set(toast.id, handle);
    }

    function removeToast(id: number) {
        for (const [k, v] of keyMap.entries()) {
            if (v === id) {
                keyMap.delete(k);
                break;
            }
        }
        clearTimeout(timers.get(id));
        timers.delete(id);

        const idx = toasts.findIndex((t) => t.id === id);
        if (idx !== -1) toasts.splice(idx, 1);
    }

    return { toasts, showToast, removeToast };
}
