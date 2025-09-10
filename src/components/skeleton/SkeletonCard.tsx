import style from "./skeletoncard.module.css";

const SkeletonCard = () => {
  return (
    <div className={`${style.skeleton} ${style["skeleton-card"]}`}>
      <div className={`${style.skeleton} ${style["skeleton-img"]}`} />
      <div className={`${style.skeleton} ${style["skeleton-text"]}`} />
      <div className={`${style.skeleton} ${style["skeleton-subtext"]}`} />
    </div>
  );
};

export default SkeletonCard;
