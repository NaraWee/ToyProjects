import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import axios, { AxiosError, AxiosResponse } from 'axios';
import { Button, ErrorBlock, Modal, Skeleton, Toast } from 'antd-mobile';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore, { Navigation, Pagination, EffectCards } from 'swiper';
import classNames from 'classnames/bind';
import PageLayout from 'components/layout/PageLayout';
import ShareButton from 'components/layout/ShareButton';
import 'swiper/css';
import 'swiper/css/effect-cards';
import { API_BASE_URL } from 'utils/config';
import LocalStorage from 'utils/localStorage';
import { destroyToken } from 'utils/auth';
import success from 'public/img/success.svg';
import styles from 'styles/Home.module.css';

const cx = classNames.bind(styles);

import { IThumbnail, IUseAPIArgs } from 'types/common';

SwiperCore.use([Navigation, Pagination, EffectCards]);

function Home() {
  const router = useRouter();
  const { isReady } = router;

  const [isSignIn, setIsSignIn] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);
  const [imageList, setImageList] = useState<IThumbnail[]>([]);
  const [nextImage, setNextImage] = useState<IThumbnail | null>(null);

  const [percent, setPercent] = useState(0);
  const [swiper, setSwiper] = useState<SwiperCore | null>(null);

  const handleProgressBar = () => {
    setPercent((prevPercent) => {
      const newPercent = prevPercent + 0.5;
      if (newPercent > 100) {
        return 100;
      }
      return newPercent;
    });
  };

  const progressBarSetTimeout = setTimeout(() => {
    !isLoading && !isError && handleProgressBar();

    clearTimeout(progressBarSetTimeout);
  }, 100);

  const fillerRelativePercentage = (100 / percent) * 100;

  const getImage: ({ limit }: { limit: number }) => Promise<AxiosResponse<IUseAPIArgs<IThumbnail[]>>> = useCallback(
    async ({ limit }) => {
      return await axios.get(`${API_BASE_URL}/api/public/post/random?limit=${limit}`);
    },
    [],
  );

  const fetchData = async (limit: number) => {
    limit === 3 && setIsLoading(true);

    try {
      const response = await getImage({ limit });
      if (limit === 3) {
        setImageList(response.data.data);
      }
      if (limit === 1) {
        setNextImage(response.data.data[0]);
      }
      handleProgressBar();
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error(error);
        setIsError(true);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!isReady) return;

    setIsSignIn(!!LocalStorage.getItem('userId'));
    fetchData(3);
  }, []);

  useEffect(() => {
    nextImage && setImageList((prevData) => [...prevData, nextImage]);
  }, [nextImage]);

  useEffect(() => {
    if (percent === 100) {
      swiper?.slideNext();
      setPercent(0);
      fetchData(1);
    }
  }, [percent]);

  const handleNextSlide = () => {
    if (percent !== 100) {
      setPercent(0);
      fetchData(1);
    }
  };

  const renderer = () => {
    if (isLoading) {
      return <Skeleton animated className={cx('skeleton')} />;
    }
    if (isError) {
      return <ErrorBlock status="disconnected" />;
    }
    if (!!imageList?.length) {
      return (
        <>
          <div className={cx('progress')} style={{ width: `${percent}%` }}>
            <div className={cx('progress-item')} style={{ width: `${fillerRelativePercentage}%` }} />
          </div>
          <Swiper
            direction="vertical"
            effect="cards"
            grabCursor={true}
            modules={[EffectCards]}
            onSwiper={setSwiper}
            onSlideChange={handleNextSlide}
            cardsEffect={{ rotate: false, perSlideRotate: 0, perSlideOffset: 11.3 }}
            navigation
            pagination={{ clickable: true }}
            allowSlidePrev={false}
          >
            {imageList.map(({ uploadUrl }, index) => (
              <SwiperSlide key={index}>
                <Image src={uploadUrl} alt="image" fill className={cx('thumbnail')} />
              </SwiperSlide>
            ))}
          </Swiper>
        </>
      );
    }

    return (
      <ErrorBlock
        status="empty"
        title="Upload your skyview"
        description={<span>Be the first to upload skyview on inthesky</span>}
      />
    );
  };

  const handleSignOut = () => {
    Modal.confirm({
      content: 'Would you like to sign out?',
      confirmText: 'Sign out',
      cancelText: 'Cancel',
      onConfirm: () => {
        destroyToken(null);
        LocalStorage.removeItem('userId');
        setIsSignIn(false);

        Toast.show({
          content: (
            <div className={cx('toast-box')}>
              <Image src={success} alt="success" width={30} height={30} />
              <span>Sign-out succeeded!</span>
            </div>
          ),
          position: 'top',
          duration: 3000,
        });
      },
    });
  };

  return (
    <PageLayout right={<ShareButton isSignIn={isSignIn} />}>
      <>{renderer()}</>
      <>
        {isSignIn && (
          <div className={cx('sign-out-wrapper')}>
            Looking for
            <Button color="primary" fill="none" onClick={handleSignOut}>
              Sign out?
            </Button>
          </div>
        )}
      </>
    </PageLayout>
  );
}

export default Home;
