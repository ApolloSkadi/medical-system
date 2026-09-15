import {useEffect, useRef, useState} from "react";

// 是否开启了系统级"减少动态效果"
export const prefersReducedMotion = () =>
    typeof window !== 'undefined'
    && typeof window.matchMedia === 'function'
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// 数字滚动动效(基于 requestAnimationFrame, easeOutCubic)
// 数据更新时从当前值滚动到新值, 而不是每次从 0 开始
export const useCountUp = (value, duration = 900) => {
    const target = Number(value) || 0;
    const [display, setDisplay] = useState(target);
    const fromRef = useRef(0);

    useEffect(() => {
        if (prefersReducedMotion() || duration <= 0) {
            fromRef.current = target;
            setDisplay(target);
            return;
        }
        const from = fromRef.current;
        if (from === target) {
            setDisplay(target);
            return;
        }
        let raf = 0;
        const startAt = performance.now();
        const step = (now) => {
            const progress = Math.min(1, (now - startAt) / duration);
            const eased = 1 - Math.pow(1 - progress, 3);
            setDisplay(Math.round(from + (target - from) * eased));
            if (progress < 1) {
                raf = requestAnimationFrame(step);
            } else {
                fromRef.current = target;
            }
        };
        raf = requestAnimationFrame(step);
        return () => cancelAnimationFrame(raf);
    }, [target, duration]);

    return display;
};

// 进入视口后再播放动效(首屏之外的内容滚动到时再动)
// 不支持 IntersectionObserver / 用户关闭动效时直接显示
export const useReveal = ({threshold = 0.08, rootMargin = '0px 0px -6% 0px'} = {}) => {
    const ref = useRef(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const el = ref.current;
        if (!el || prefersReducedMotion() || typeof IntersectionObserver === 'undefined') {
            setVisible(true);
            return;
        }
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setVisible(true);
                    observer.disconnect();
                }
            });
        }, {threshold, rootMargin});
        observer.observe(el);
        return () => observer.disconnect();
    }, [threshold, rootMargin]);

    return [ref, visible];
};
