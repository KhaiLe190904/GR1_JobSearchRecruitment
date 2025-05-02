import classes from './Box.module.scss';
export function Box({ children }: {children: React.ReactNode}) {
    return(
    <div className={classes.root}>{children}</div>);
}