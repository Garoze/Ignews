import Link from "next/link";
import { ActiveLink } from "../ActiveLink";

import { SignInButton } from "../SignInButton";

import style from "./styles.module.scss";

export const Header = () => {
  return (
    <header className={style.headerContainer}>
      <div className={style.headerContent}>
        <img src="/images/logo.svg" alt="ig.news" />
        <nav>
          <ActiveLink activeClassName={style.active} href="/">
            <a>Home</a>
          </ActiveLink>
          <ActiveLink activeClassName={style.active} href="/posts">
            <a>Posts</a>
          </ActiveLink>
        </nav>
        <SignInButton />
      </div>
    </header>
  );
};
