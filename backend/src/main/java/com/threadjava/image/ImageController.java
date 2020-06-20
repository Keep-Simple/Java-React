package com.threadjava.image;

import com.threadjava.image.dto.ImageDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Arrays;
import java.util.List;

@RestController
@RequestMapping("/api/images")
public class ImageController {
    final
    ImageService imageService;

    public ImageController(ImageService imageService) {
        this.imageService = imageService;
    }

    @PostMapping
    public ImageDto post(@RequestParam("image") MultipartFile file,
                         @RequestParam(required = false) Double x,
                         @RequestParam(required = false) Double y,
                         @RequestParam(required = false) Double width) throws IOException {
        if (x != null && y != null && width != null)
            return imageService.upload(file, new double[]{x, y, width});

        return imageService.upload(file, null);
    }
}
