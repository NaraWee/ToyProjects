import { Dispatch, SetStateAction, useState } from 'react';
import Image from 'next/image';
import { Button, ImageUploadItem, Input, SpinLoading, Toast } from 'antd-mobile';
import axios from 'axios';
import classNames from 'classnames/bind';
import SearchIcon from 'public/img/search.svg';
import SearchBlackIcon from 'public/img/searchBlack.svg';
import success from 'public/img/success.svg';
import fail from 'public/img/fail.svg';
import { API_BASE_URL } from 'utils/config';
import LocalStorage from 'utils/localStorage';
import { getToken } from 'utils/auth';
import styles from './LocationModal.module.css';

const cx = classNames.bind(styles);

interface ILocationModalProps {
  image?: ImageUploadItem;
  setModalVisible: Dispatch<SetStateAction<boolean>>;
  location: string;
  setLocation: Dispatch<SetStateAction<string>>;
}

function LocationModal({ image, setModalVisible, location, setLocation }: ILocationModalProps) {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const handleUploadImageSubmit = async () => {
    try {
      setIsLoading(true);
      await axios.put(image?.extra?.preSignedUrl, image?.extra?.file, {
        headers: {
          'Content-Type': image?.extra?.file?.type,
        },
      });
      await axios.post(
        `${API_BASE_URL}/api/post/${image?.extra?.file.name}`,
        {
          isAccept: '1',
          postName: '',
          location,
          userId: LocalStorage.getItem('userId'),
        },
        {
          params: {
            fileName: image?.extra?.file?.name,
            tempPath: `temp/${image?.extra?.file?.name}`,
          },
          headers: {
            Authorization: getToken(null),
          },
        },
      );
      Toast.show({
        content: (
          <div className={cx('toast-box')}>
            <Image src={success} alt="success" width={30} height={30} />
            <span>Upload succeeded!</span>
          </div>
        ),
        position: 'bottom',
        duration: 3000,
      });
    } catch (err) {
      console.error(err);
      Toast.show({
        content: (
          <div className={cx('toast-box')}>
            <Image src={fail} alt="fail" width={30} height={30} />
            <span>'Upload failed! Please try again later</span>
          </div>
        ),
        position: 'bottom',
        duration: 3000,
      });
    } finally {
      setModalVisible(false);
      setIsLoading(false);
    }
  };

  return (
    <>
      {step === 1 && (
        <div className={cx('wrapper')}>
          <h1>Last step before you upload</h1>
          <span>Add location to your sky?</span>
          <div className={cx('image-wrapper')}>
            {image?.url ? (
              <Image src={image.url} fill alt="uploaded image" className={cx('thumbnail')} />
            ) : (
              <SpinLoading />
            )}
            <span>{location ? location : 'Your location'}</span>
          </div>
          {location ? (
            <Button className={cx('button')} color="primary" loading={isLoading} onClick={handleUploadImageSubmit}>
              Off to the sky!
            </Button>
          ) : (
            <Button className={cx('button')} color="primary" onClick={() => setStep(2)}>
              Add location
            </Button>
          )}
          {location ? (
            <Button className={cx(['button', 'without-location'])} color="primary" onClick={() => setStep(2)}>
              Reselect location
            </Button>
          ) : (
            <Button
              className={cx(['button', 'without-location'])}
              color="primary"
              onClick={() => setLocation('Somewhere in the world!')}
            >
              Upload without location
            </Button>
          )}
        </div>
      )}
      {step === 2 && (
        <div className={cx('wrapper')}>
          <h1>Add location</h1>
          <div className={cx('input-wrapper')}>
            <Input
              placeholder="Search any locations"
              className={cx(['location', { focused: !!location?.length }])}
              onChange={(val) => {
                setLocation(val);
              }}
              clearable
              value={location}
              onEnterPress={() => setStep(1)}
            />
            <Image
              src={!!location?.length ? SearchBlackIcon : SearchIcon}
              alt="Search icon"
              width={24}
              height={24}
              className={cx('search')}
            />
          </div>
          <h4 className={cx('popular')}>Popular</h4>
          <ul className={cx('list')}>
            <li
              onClick={() => {
                setLocation('Seoul, Korea');
                setStep(1);
              }}
            >
              Seoul, Korea
            </li>
            <li
              onClick={() => {
                setLocation('London, United Kingdom');
                setStep(1);
              }}
            >
              London, United Kingdom
            </li>
            <li
              onClick={() => {
                setLocation('Tokyo, Japan');
                setStep(1);
              }}
            >
              Tokyo, Japan
            </li>
            <li
              onClick={() => {
                setLocation('Paris, France');
                setStep(1);
              }}
            >
              Paris, France
            </li>
          </ul>
        </div>
      )}
    </>
  );
}

export default LocationModal;
