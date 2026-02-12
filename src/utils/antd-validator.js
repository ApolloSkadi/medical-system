// 手机号验证
export const validatePhoneNumber = (options = {}) => ({
  validator: (_, value) => {
    if (!value) return Promise.resolve();
    const phoneRegex = /^1[3-9]\d{9}$/;
    if (!phoneRegex.test(value)) return Promise.reject('请输入有效的手机号');
    return Promise.resolve();
  },
  ...options,
});
// 邮箱校验
export const validateEmail = (options = {}) => ({
  validator: (_, value) => {
    if (!value) return Promise.resolve();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) return Promise.reject('请输入有效的邮箱地址');
    return Promise.resolve();
  },
  ...options,
});
export const validateConfirmOrderId = (options = {}) => ({
  validator: (_, value) => {
    if (!value) return Promise.resolve();
    const emailRegex = /^[A-Za-z0-9,]+$/;
    if (!emailRegex.test(value)) return Promise.reject('请输入有效的确认号');
    return Promise.resolve();
  },
  ...options,
})

// 简单校验非空
export const easyNotNull = (options) => {
  let message = '';
  let optionOther = {};
  if (typeof options === 'string') {
    message = `${options}不能为空！`;
  } else {
    const { message, ...other } = options;
    optionOther = other;
  }

  return [
    {
      required: true,
      message,
      ...optionOther,
    },
  ];
};

// 特殊词汇校验
export const validateSpecialLexicon = (lexiconList = []) => ({
  validator:(_, value) => {
    if (!value) return Promise.resolve();
    if (lexiconList.includes(value)) {
      return Promise.reject('非法节点无法使用');
    }
    return Promise.resolve();
  }
})