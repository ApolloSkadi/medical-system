import styles from './index.module.scss';

const SearchRow = ({ children, rowClass, ...args }) => {
    return (
        children ? <div className={`${styles['search-row']} ${rowClass}`} {...args}>
            {children}
        </div> : <></>
    );
};
const SearchRowItem = ({
    title,
    children,
    itemClass = '',
    titleStyles = {},
    titleClass = '',
    contentStyles = {},
    contentClass = '',
    ...args
}) => {
    return (
        <div className={`${styles['search-row__item']} ${itemClass}`} {...args}>
            {title && (
                <div
                    className={`${styles['search-item__title']} theme-text-333 ${titleClass} whitespace-nowrap`}
                    style={titleStyles}
                >
                    {title}
                </div>
            )}
            {children && (
                <div
                    className={`${styles['search-item__content']} ${contentClass}`}
                    style={contentStyles}
                >
                    {children}
                </div>
            )}
        </div>
    );
};
SearchRow.Item = SearchRowItem;
export default SearchRow;
