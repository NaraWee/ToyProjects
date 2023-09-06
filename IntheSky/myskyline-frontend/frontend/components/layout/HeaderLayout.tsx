import Link from 'next/link';
import Image from 'next/image';
import { NavBar } from 'antd-mobile';
import classNames from 'classnames/bind';
import inthesky from 'public/img/inthesky.svg';
import styles from './HeaderLayout.module.css';

const cx = classNames.bind(styles);

function HeaderLayout({ right }: { right?: React.ReactNode }) {
  return (
    <div className={cx('container')}>
      <NavBar
        backArrow={false}
        back={null}
        left={
          <Link href="/">
            <Image src={inthesky} alt="inthesky" width={99} height={24} />
          </Link>
        }
        {...(right && { right })}
      />
    </div>
  );
}

export default HeaderLayout;
