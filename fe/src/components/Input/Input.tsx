import { InputHTMLAttributes } from 'react';
import classes from './Input.module.css';
type InputProps = InputHTMLAttributes<HTMLInputElement> & {
    label?: string;
    size?: "small" | "medium" | "large";
};
export function Input({label, size, width, ...otherProps}: InputProps) {
    return(
    <div className={`${classes.root} ${classes[size || "large"]}` }>
        <label>{label}</label>
        <input {...otherProps}
        style={{
            width: width? '${width}px' : "100%"
        }}
        />
    </div>);
}