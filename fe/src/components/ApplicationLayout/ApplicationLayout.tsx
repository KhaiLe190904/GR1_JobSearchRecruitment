import { Outlet } from "react-router-dom";
import classes from "./ApplicationLayout.module.css";
import { Header } from "../Header/Header";
export function ApplicationLayout() {
  return (
    <div className={classes.root}>
      <Header />
      <main className={classes.main}>
        <div className={classes.container}>
          <Outlet />
        </div>
      </main>
    </div>
  );
}
