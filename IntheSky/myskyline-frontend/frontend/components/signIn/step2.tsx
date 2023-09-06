import { FormEvent, useState } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { Button, Input, Toast } from 'antd-mobile';
import axios, { AxiosResponse } from 'axios';
import classNames from 'classnames/bind';
import success from 'public/img/success.svg';
import fail from 'public/img/fail.svg';
import { API_BASE_URL } from 'utils/config';
import { setToken } from 'utils/auth';
import LocalStorage from 'utils/localStorage';
import styles from './step.module.css';

import { ILogin, IUseAPIArgs } from 'types/common';

const cx = classNames.bind(styles);

interface IStep2Props {
  type: 'signIn' | 'signUp';
  email: string;
}

function Step2({ type, email }: IStep2Props) {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const getSignIn = async (): Promise<AxiosResponse<IUseAPIArgs<ILogin>>> =>
    await axios.post(`${API_BASE_URL}/api/public/login`, {
      userId: email,
      password,
    });

  const getSignUp = async (): Promise<AxiosResponse<IUseAPIArgs<ILogin>>> =>
    await axios.post(`${API_BASE_URL}/api/public/signup`, {
      userId: email,
      password,
      isAgree: true,
    });

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();

    setIsLoading(true);
    try {
      const { data } = type === 'signIn' ? await getSignIn() : await getSignUp();
      const status = data.statusCode;

      if (status === 200) {
        const jwt = data.data?.token;
        const userId = data.data?.userId;

        setToken(null, jwt);
        LocalStorage.setItem('userId', String(userId));

        Toast.show({
          content: (
            <div className={cx('toast-box')}>
              <Image src={success} alt="success" width={30} height={30} />
              <span>{type === 'signIn' ? 'Sign-in' : 'Sign-up'} succeeded!</span>
            </div>
          ),
          position: 'top',
          duration: 3000,
        });

        return router.push('/');
      } else {
        Toast.show({
          content: (
            <div className={cx('toast-box')}>
              <Image src={fail} alt="fail" width={30} height={30} />
              <span>
                {type === 'signIn' ? 'Sign-in' : 'Sign-up'} failed! {data.message}. Please try again later
              </span>
            </div>
          ),
          position: 'top',
          duration: 3000,
        });
      }
    } catch (err) {
      console.error(err);
      Toast.show({
        content: (
          <div className={cx('toast-box')}>
            <Image src={fail} alt="fail" width={30} height={30} />
            <span>{type === 'signIn' ? 'Sign-in' : 'Sign-up'} failed! Please try again later</span>
          </div>
        ),
        position: 'top',
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={(e) => handleLogin(e)}>
      <div className={cx(['background-circle', 'signup'])} />
      <div className={cx('content')}>
        <h1 className={cx(['title', 'step2'])}> {type === 'signIn' ? 'Sign in' : 'Sign up'}</h1>
        <span className={cx('email-info')}>
          {type === 'signIn' ? 'Enter your password for' : 'Create an account for'}
          <br />
          <span>{email}</span>
        </span>
        <Input
          placeholder="Password"
          className={cx('password')}
          onChange={(val) => {
            setPassword(val);
          }}
          clearable
          type="password"
        />
        <p className={cx('description')}>
          By selecting continue below,
          <br />I agree to <span>Terms of Service</span> and <span>Privacy Policy</span>
        </p>
        <Button className={cx(['button', 'step2'])} color="primary" type="submit" loading={isLoading}>
          Continue
        </Button>
      </div>
    </form>
  );
}

export default Step2;
