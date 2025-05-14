import { ReactNode } from "react";
import classes from "./Seperator.module.css";

export function Seperator({ children }: { children?: ReactNode }) {
    return <div className={classes.separator}>{children}</div>;
}