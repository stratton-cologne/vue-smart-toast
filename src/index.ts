import type { App, Plugin } from "vue";
import Notifications from "./notifications.vue";
import "./style.css";

export * from "./useToast";
export { Notifications };

const ToastPlugin: Plugin = {
    install(app: App) {
        app.component("ToastNotifications", Notifications);
    },
};

export default ToastPlugin;
