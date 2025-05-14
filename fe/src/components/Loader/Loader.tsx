import classes from "./Loader.module.css";
export function Loader() {
  return (
    <div className={classes.root}>
      <img src="/logo.svg" alt="Loading..." />
      <div className={classes.container}>
        <div className={classes.content}></div>
      </div>
    </div>
  );
}