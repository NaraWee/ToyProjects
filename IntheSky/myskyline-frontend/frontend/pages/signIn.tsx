import { useState } from 'react';
import classNames from 'classnames/bind';
import PageLayout from 'components/layout/PageLayout';
import Step1 from 'components/signIn/step1';
import Step2 from 'components/signIn/step2';
import styles from 'styles/SignIn.module.css';

const cx = classNames.bind(styles);

function SignIn() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');

  return (
    <div className={cx('wrapper')}>
      {step === 1 && <Step1 type="signIn" setEmail={setEmail} setStep={setStep} />}
      {step === 2 && <Step2 type="signIn" email={email} />}
    </div>
  );
}

SignIn.getLayout = function getLayout(page: React.ReactNode) {
  return <PageLayout>{page}</PageLayout>;
};

export default SignIn;
