import styles from './index.module.scss';
import { clsx } from 'clsx'

export default ({ children, wrap, ...args }) => {
  return <div className={clsx(styles['action-wrapper'], {
    [`${styles['action-wrapper_wrap']}`]: wrap,
  })} {...args}>{children}</div>;
};
