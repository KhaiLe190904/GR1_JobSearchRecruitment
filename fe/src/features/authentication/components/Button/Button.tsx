import { ButtonHTMLAttributes } from 'react';
import classes from './Button.module.css';
type ButtonProps = ButtonHTMLAttributes<HTMLInputElement> & {
    outline?: boolean;

};
export function Button({outline, children, ...others}: ButtonProps) {
    return(
        <button {...others} className={`${classes.button} ${outline ? classes.outline : ""}`}>
            {children}
        </button>
        );
}