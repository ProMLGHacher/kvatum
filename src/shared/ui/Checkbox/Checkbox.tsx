import cls from './Checkbox.module.scss';
import Tick from '@/shared/svg/tick.svg?react';

type CheckboxProps = {
    id: string;
    defaultChecked: boolean;
    onChange?: (e?: boolean) => void;
}


export const Checkbox = ({ id, defaultChecked: checked, onChange }: CheckboxProps) => {
    return (
        <label htmlFor={id} className={cls.checkbox}>
            <input
                className={cls.checkbox__input}
                type="checkbox"
                id={id}
                defaultChecked={checked}
                onChange={(e) => {
                    e.stopPropagation()
                    onChange && onChange(e.target.checked);
                }}
            />
            <span className={cls.checkbox__box}>
                <Tick className={cls.checkbox__tick} />
            </span>
        </label>
    )
}
