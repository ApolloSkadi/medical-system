// SaaS管理页面公共工具

// JSON文本校验器（用于映射配置等 textarea）
export const jsonValidator = (label) => ({
    validator: (_, value) => {
        if (!value) return Promise.resolve();
        try {
            JSON.parse(value);
            return Promise.resolve();
        } catch (e) {
            return Promise.reject(new Error(`${label}必须是合法的JSON字符串`));
        }
    },
});

// 根据选项数组渲染状态标签数据
export const findOption = (options, value) => options.find(v => v.value === value);
