package com.threadjava.image;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.threadjava.image.dto.ImageDto;
import com.threadjava.image.dto.ImgurResponce;
import com.threadjava.image.model.Image;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;

@Service
public class ImageService {
    @Value(value = "${imgur.id}")
    private String IMGUR_ID;
    final ImageRepository imageRepository;

    public ImageService(ImageRepository imageRepository) {
        this.imageRepository = imageRepository;
    }

    public ImageDto upload(MultipartFile file, double[] cropProps) throws IOException {
        var result = this.uploadFile(file.getBytes(), cropProps);
        var image = new Image();
        image.setLink(result.getData().getLink());
        image.setDeleteHash(result.getData().getDeletehash());
        var imageEntity = imageRepository.save(image);
        return ImageMapper.MAPPER.imageToImageDto(imageEntity);
    }

    private ImgurResponce uploadFile(byte[] bytes, double[] cropProps) throws IOException {
        var headers = new HttpHeaders();
        headers.setContentType(MediaType.MULTIPART_FORM_DATA);
        headers.add("Authorization", "Client-ID " + IMGUR_ID);

        var body = new LinkedMultiValueMap<>();

        // Processing crop if needed
        if (cropProps != null) {
            InputStream in = new ByteArrayInputStream(bytes);
            BufferedImage originalImage = ImageIO.read(in);
            BufferedImage croppedImage = originalImage.getSubimage(
                    (int)(originalImage.getWidth() * cropProps[0] / 100),
                    (int)(originalImage.getHeight() * cropProps[1] / 100),
                    (int)(originalImage.getWidth() * cropProps[2] / 100),
                    (int)(originalImage.getWidth() * cropProps[2] / 100)
            );
            var baos = new ByteArrayOutputStream();
            ImageIO.write(croppedImage, "png", baos);
            bytes = baos.toByteArray();
        }

        body.add("image", bytes);

        var requestEntity = new HttpEntity<>(body, headers);

        var serverUrl = "https://api.imgur.com/3/upload";

        var restTemplate = new RestTemplate();
        var response = restTemplate.postForEntity(serverUrl, requestEntity, String.class);
        var json = response.getBody();
        var mapper = new ObjectMapper();
        return mapper.readValue(json, ImgurResponce.class);
    }


}
