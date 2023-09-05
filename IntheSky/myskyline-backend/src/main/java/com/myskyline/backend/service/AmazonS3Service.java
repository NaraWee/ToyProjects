package com.myskyline.backend.service;

import com.amazonaws.HttpMethod;
import com.amazonaws.SdkClientException;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.Headers;
import com.amazonaws.services.s3.model.*;
import com.myskyline.backend.config.AmazonS3Config;
import com.myskyline.backend.handler.exception.NotFoundException;
import io.micrometer.common.util.StringUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.net.URL;
import java.util.Date;

@Service
@RequiredArgsConstructor
public class AmazonS3Service {

    private final AmazonS3Config amazonS3Config;

    private String bucket = "skyswap";

    public String getPreSignedUrl(String tempPath) {
        AmazonS3 s3Client = amazonS3Config.amazonS3();

        GeneratePresignedUrlRequest generatePresignedUrlRequest = getGeneratePreSignedUrlRequest(bucket, tempPath);
        URL url = s3Client.generatePresignedUrl(generatePresignedUrlRequest);
        return url.toString();
    }

    private GeneratePresignedUrlRequest getGeneratePreSignedUrlRequest(String bucket, String tempPath) {
        GeneratePresignedUrlRequest generatePresignedUrlRequest =
                new GeneratePresignedUrlRequest(bucket, tempPath)
                        .withMethod(HttpMethod.PUT)
                        .withExpiration(getPreSignedUrlExpiration());
        generatePresignedUrlRequest.addRequestParameter(
                Headers.S3_CANNED_ACL,
                CannedAccessControlList.PublicRead.toString());
        return generatePresignedUrlRequest;
    }

    private Date getPreSignedUrlExpiration() {
        Date expiration = new Date();
        long expTimeMillis = expiration.getTime();
        expTimeMillis += 1000 * 60 * 2;
        expiration.setTime(expTimeMillis);
        return expiration;
    }

    public String upload(MultipartFile file, String dirName, String filePath) throws IOException {

        AmazonS3 s3Client = amazonS3Config.amazonS3();

        // create folder
        String folderName = dirName+"/";

        ObjectMetadata objectMetadata = new ObjectMetadata();
        objectMetadata.setContentLength(0L);
        objectMetadata.setContentType("application/x-directory");
        PutObjectRequest putObjectRequest = new PutObjectRequest(bucket, folderName, new ByteArrayInputStream(new byte[0]), objectMetadata);

        try {
            s3Client.putObject(putObjectRequest);
        } catch (AmazonS3Exception e) {
            e.printStackTrace();
            throw new AmazonS3Exception("Upload failed.");
        } catch(SdkClientException e) {
            e.printStackTrace();
            throw new SdkClientException("Upload failed.");
        }

        s3Client.putObject(new PutObjectRequest(bucket, filePath, file.getInputStream(), null)
                .withCannedAcl(CannedAccessControlList.PublicRead));
        return s3Client.getUrl(bucket, filePath).toString();
    }

    public String copy(String tempPath, String dirName, String filePath) {

        AmazonS3 s3Client = amazonS3Config.amazonS3();

        // create folder
        String folderName = dirName+"/";

        ObjectMetadata objectMetadata = new ObjectMetadata();
        objectMetadata.setContentLength(0L);
        objectMetadata.setContentType("application/x-directory");
        PutObjectRequest putObjectRequest = new PutObjectRequest(bucket, folderName, new ByteArrayInputStream(new byte[0]), objectMetadata);

        try {
            s3Client.putObject(putObjectRequest);
        } catch (AmazonS3Exception e) {
            e.printStackTrace();
        } catch(SdkClientException e) {
            e.printStackTrace();
        }

        try {
            CopyObjectRequest req = new CopyObjectRequest(bucket, tempPath, bucket, filePath);
            s3Client.copyObject(req);
        } catch (AmazonS3Exception e) {
            e.printStackTrace();
            throw new AmazonS3Exception("Upload failed.");
        } catch(SdkClientException e) {
            e.printStackTrace();
            throw new SdkClientException("Upload failed.");
        }

        String uploadUrl = s3Client.getUrl(bucket, filePath).toString();
        if(StringUtils.isEmpty(uploadUrl)) {
            throw new NotFoundException("Upload failed.");
        }

        return uploadUrl;

    }

    public void delete(String uploadPath) {

        AmazonS3 s3Client = amazonS3Config.amazonS3();

        // delete object
        try {
            s3Client.deleteObject(bucket, uploadPath);
        } catch (AmazonS3Exception e) {
            e.printStackTrace();
            throw new AmazonS3Exception("Error while deleting.");
        } catch(SdkClientException e) {
            e.printStackTrace();
            throw new SdkClientException("Error while deleting.");
        }

    }
}
