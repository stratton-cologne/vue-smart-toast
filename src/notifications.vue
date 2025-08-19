<template>
    <div class="notifications-container">
        <template v-for="pos in uniquePositions" :key="pos">
            <transition-group appear :name="getTransitionName(pos)" tag="div" class="toasts-wrapper">
                <div v-for="toast in toastsByPosition[pos]" :key="toast.id" class="toast"
                    :class="[toast.type, toast.position]" @mouseenter="pause(toast)" @mouseleave="resume(toast)">
                    <div class="message mr-4" v-html="toast.message"></div>
                    <button class="close-btn" @click="removeToast(toast.id)">✕</button>
                </div>
            </transition-group>
        </template>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { Toast } from './useToast';
import { useToast } from './useToast';

const { toasts, removeToast } = useToast();

const timers = new Map<number, ReturnType<typeof setTimeout>>();

function pause(toast: Toast) {
    const h = timers.get(toast.id);
    if (h) clearTimeout(h);
}

function resume(toast: Toast) {
    const h = setTimeout(() => removeToast(toast.id), toast.duration);
    timers.set(toast.id, h);
}

const uniquePositions = computed<string[]>(() =>
    Array.from(new Set(toasts.map(t => t.position)))
);

const toastsByPosition = computed<Record<string, Toast[]>>(() => {
    return uniquePositions.value.reduce((acc, pos) => {
        acc[pos] = toasts.filter(t => t.position === pos);
        return acc;
    }, {} as Record<string, Toast[]>);
});

function getTransitionName(pos: string): string {
    switch (pos) {
        case 'top-center': return 'slide-down';
        case 'top-left': return 'slide-right';
        case 'top-right': return 'slide-left';
        case 'bottom-center': return 'slide-up';
        case 'bottom-left': return 'slide-up-right';
        case 'bottom-right': return 'slide-up-left';
        case 'center':
        case 'center-left':
        case 'center-right':
        default: return 'fade';
    }
}
</script>
