import style from "./skeletoncard.module.css";

const SkeletonWelcome = () => (
  <div className={style["skeleton-welcome"]}>
    <div className={`${style.skeleton} ${style["skeleton-welcome-title"]}`} />
    <div className={`${style.skeleton} ${style["skeleton-welcome-sub"]}`} />
  </div>
);

export default SkeletonWelcome;
