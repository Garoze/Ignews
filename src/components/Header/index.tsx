import { SignInButton } from "../SignInButton";

import style from "./styles.module.scss";

export const Header = () => {
  return (
    <header className={style.headerContainer}>
      <div className={style.headerContent}>
        <img src="/images/logo.svg" alt="ig.news" />
        <nav>
          <a href="#" className={style.active}>
            Home
          </a>
          <a href="#">Posts</a>
        </nav>
        <SignInButton />
      </div>
    </header>
  );
};
