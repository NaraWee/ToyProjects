import Link from 'next/link';
import { Button, Input } from 'antd-mobile';
import classNames from 'classnames/bind';
import styles from './step.module.css';
import { Dispatch, SetStateAction } from 'react';

const cx = classNames.bind(styles);

interface IStep1Props {
  type: 'signIn' | 'signUp';
  setEmail: Dispatch<SetStateAction<string>>;
  setStep: Dispatch<SetStateAction<number>>;
}

function Step1({ type, setEmail, setStep }: IStep1Props) {
  return (
    <form onSubmit={() => setStep(2)}>
      <div className={cx('background-circle')} />
      <div className={cx('content')}>
        <h1 className={cx(['title', 'step1'])}>
          {type === 'signIn' ? (
            <>
              Sign-in to your
              <br />
              account to upload
              <br />
              your skyview
            </>
          ) : (
            <>
              Explore skyview of
              <br />
              somewhere in the
              <br />
              world
            </>
          )}
        </h1>
        <Input
          placeholder="Email"
          className={cx('email')}
          onChange={(val) => {
            setEmail(val);
          }}
          clearable
        />
        <Button className={cx(['button', { 'sign-in': type === 'signIn' }])} color="primary" type="submit">
          Continue
        </Button>
        {type === 'signIn' && (
          <div className={cx('detail')}>
            <span>Don't have an account?</span>
            <Link href="/signUp">
              <span>Sign up</span>
            </Link>
          </div>
        )}
      </div>
    </form>
  );
}

export default Step1;
