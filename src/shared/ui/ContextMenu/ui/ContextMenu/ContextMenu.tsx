import { createPortal } from 'react-dom'
import cls from './ContextMenu.module.scss'
import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useId } from 'react'
import { ContextMenuItem } from '../../types/ContextMenu'
import { classNames } from '@/shared/lib/classNames/classNames'
import { Checkbox } from '@/shared/ui/Checkbox/Checkbox'

export type ContextMenuProps = {
    items: ContextMenuItem[],
    onClose: () => void,
    position?: {
        x: number,
        y: number,
    }
}

const ContextMenuItemComponent = ({ item }: { item: ContextMenuItem }) => {

    const htmlId = useId();

    return (
        <label key={item.id} htmlFor={htmlId} className={classNames(cls.contextMenuItem, {
            [cls.contextMenuItemDisabled]: item.disabled,
            [cls.contextMenuItemDanger]: item.danger,
        })} onClick={(e) => {
            e.stopPropagation()
            item.type != 'checkbox' && item.onClick()
        }}>
            {item.icon && <div className={cls.contextMenuItemIcon}>{item.icon}</div>}
            <div className={cls.contextMenuItemText}>
                <div className={cls.contextMenuItemTextContent}>
                    <p className={classNames(cls.contextMenuItemText, {
                        [cls.contextMenuItemTextDanger]: item.danger,
                    })}>{item.text}</p>
                    {item.children && <p>{'>'}</p>}
                    {item.type === 'checkbox' && <Checkbox id={htmlId} defaultChecked={item.checked!} onChange={item.onClick} />}
                </div>
                {item.subContent && <div className={cls.contextMenuItemSubContent}>{item.subContent}</div>}
            </div>
            {
                item.children && <div className={cls.contextMenuItemChildrenWrapper}>
                    <div className={cls.contextMenuItemChildren}>
                        {item.children.map((child) => (
                            <ContextMenuItemComponent key={child.id} item={child} />
                        ))}
                    </div>
                </div>
            }
        </label>
    )
};

export const ContextMenu = ({ items, position, onClose }: ContextMenuProps) => {

    useEffect(() => {
        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                event.preventDefault()
                onClose();
            }
        };

        const handleClickOutside = (event: MouseEvent) => {
            if (!(event.target as HTMLElement).closest(`.${cls.contextMenu}`)) {
                onClose();
            }
        };

        document.addEventListener('keydown', handleEscape);
        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [])

    return (
        createPortal(
            <AnimatePresence>
                {
                    position && <motion.div
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.5 }}
                        transition={{ duration: 0.2 }}
                        style={{ top: position.y, left: position.x }}
                        className={classNames(cls.contextMenu, {
                            [cls.contextMenuRight]: position.x > window.innerWidth / 1.6,
                            [cls.contextMenuBottom]: position.y > window.innerHeight / 1.6,
                        })}
                        layout
                    >
                        {items.map((item) => (
                            <ContextMenuItemComponent key={item.id} item={item} />
                        ))}
                    </motion.div>
                }
            </AnimatePresence>,
            document.body
        )
    )
}
