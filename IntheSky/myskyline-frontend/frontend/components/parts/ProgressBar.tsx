import { useEffect, useState } from 'react';
import classNames from 'classnames/bind';
import styles from 'styles/Home.module.css';
import SwiperCore from 'swiper';
const cx = classNames.bind(styles);

interface IProgressBarProps {
  swiper: SwiperCore | null;
  percent: number;
  setPercent: React.Dispatch<React.SetStateAction<number>>;
}

function ProgressBar({ swiper, percent, setPercent }: IProgressBarProps) {
  useEffect(() => {
    if (percent === 100) swiper?.slideNext();

    const intervalId = setInterval(() => {
      setPercent((prevPercent) => {
        if (prevPercent >= 100) {
          return 0;
        } else {
          return prevPercent + 1;
        }
      });
    }, 100);

    return () => clearInterval(intervalId);
  }, []);

  const fillerRelativePercentage = (100 / percent) * 100;

  return (
    <>
      <div className={cx('progress')} style={{ width: `${percent}%` }}>
        <div className={cx('progress-item')} style={{ width: `${fillerRelativePercentage}%` }} />
      </div>
    </>
  );
}

export default ProgressBar;
