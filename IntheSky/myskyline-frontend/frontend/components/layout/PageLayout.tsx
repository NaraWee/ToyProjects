import Head from 'next/head';
import classNames from 'classnames/bind';
import HeaderLayout from './HeaderLayout';
import styles from './PageLayout.module.css';

const cx = classNames.bind(styles);

interface IPageLayoutProps {
  children: React.ReactNode;
  right?: React.ReactNode;
}

function PageLayout({ children, right }: IPageLayoutProps) {
  return (
    <>
      <div className={cx('container')}>
        <nav className={cx('top-container')}>
          <HeaderLayout right={right} />
        </nav>
        <div className={cx('body-container')}>
          <div className={cx('body')}>{children}</div>
        </div>
      </div>
    </>
  );
}

export default PageLayout;
