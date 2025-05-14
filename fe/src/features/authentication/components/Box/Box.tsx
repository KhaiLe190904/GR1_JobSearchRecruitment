import classes from './Box.module.css';
export function Box({ children }: {children: React.ReactNode}) {
    return(
    <div className={classes.root}>{children}</div>);
}