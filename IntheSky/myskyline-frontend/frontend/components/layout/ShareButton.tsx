import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button, ImageUploader, ImageUploadItem, Modal, Toast } from 'antd-mobile';
import axios from 'axios';
import classNames from 'classnames/bind';
import LocationModal from 'components/parts/LocationModal';
import { API_BASE_URL } from 'utils/config';
import { getToken } from 'utils/auth';
import fail from 'public/img/fail.svg';
import styles from './ShareButton.module.css';

const cx = classNames.bind(styles);

export function ButtonComponent() {
  return (
    <Button size="large" fill="outline" shape="rounded" className={cx('share-button')}>
      Share your sky
    </Button>
  );
}

interface IShareButtonProps {
  isSignIn?: boolean;
}

function ShareButton({ isSignIn }: IShareButtonProps) {
  const [fileList, setFileList] = useState<ImageUploadItem[]>();
  const [modalVisible, setModalVisible] = useState(false);
  const [location, setLocation] = useState<string>('');

  const handleUpload = async (file: File): Promise<ImageUploadItem> => {
    setModalVisible(true);
    try {
      const getPreSignedUrl = await axios.get(`${API_BASE_URL}/api/post/presignedurl`, {
        params: {
          tempPath: `temp/${file.name}`,
        },
        headers: {
          Authorization: getToken(null),
        },
      });

      return {
        url: URL.createObjectURL(file),
        extra: {
          file,
          preSignedUrl: getPreSignedUrl.data.data,
        },
      };
    } catch (exception) {
      console.error(exception);
      Toast.show({
        content: (
          <div className={cx('toast-box')}>
            <Image src={fail} alt="fail" width={30} height={30} />
            <span>'Upload failed! Please try again later</span>
          </div>
        ),
        position: 'top',
        duration: 3000,
      });

      return {
        url: '',
      };
    }
  };

  return (
    <>
      {isSignIn ? (
        <ImageUploader
          value={fileList}
          upload={handleUpload}
          renderItem={() => <ShareButton isSignIn={true} />}
          maxCount={1}
          onChange={setFileList}
        >
          <ButtonComponent />
        </ImageUploader>
      ) : (
        <Link href="/signIn">
          <ButtonComponent />
        </Link>
      )}
      <Modal
        visible={modalVisible}
        content={
          <LocationModal
            image={fileList?.[0]}
            setModalVisible={setModalVisible}
            location={location}
            setLocation={setLocation}
          />
        }
        closeOnMaskClick
        showCloseButton
        onClose={() => {
          setModalVisible(false);
        }}
      />
    </>
  );
}

export default ShareButton;
