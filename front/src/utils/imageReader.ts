import * as loadImage from "blueimp-load-image";

export interface ImageReaderOption {
    maxWidth: number,
    maxHeight: number,
};

interface ImageSize {
    width: number;
    height: number;
} 

export default class ImageReader {
    private option: ImageReaderOption;

    constructor(option?: ImageReaderOption) {
        this.option = option || {
            maxWidth: 500,
            maxHeight: 500,
        }
    }

    read(file: File, callback : (resizeImage: File) => void) {
        if (this.checkFyleType(file) === false) {
            console.error("not supported.")
            callback(null);
            return;
        }

        loadImage.parseMetaData(file, (data: any) => {
            let options : any = {maxWidth: this.option.maxWidth, maxHeight: this.option.maxHeight, canvas: true};
            if (data.exif) {
                options.orientation = data.exif.get('Orientation');
            }
            loadImage(file, (canvas: any) => {
                canvas.toBlob((blob: any) => {
                    const imageFile = new File([blob], file.name, {
                        type: file.type,
                        lastModified: Date.now()
                    });
                    callback(imageFile);
                }, file.type, 1);
            }, options);
        });
    }
    
    private fixSize(image: HTMLImageElement): ImageSize {
        let {maxWidth, maxHeight} = this.option;
        let size = { width: image.width, height: image.height};
        if (image.width < maxWidth && image.height < maxHeight) {
            return size;
        }

        if (image.width > image.height) {
            const ratio = image.height/image.width;
            size.width = maxWidth;
            size.height = maxWidth * ratio;
        } else {
            const ratio = image.width/image.height;
            size.width = maxHeight * ratio;
            size.height = maxHeight;
        }

        return size;
    }

    private checkFyleType(file: File): boolean {
        const type = file.type.toLowerCase();
        if (type === 'image/jpeg') {
            return true;
        }
        if (type === 'image/png') {
            return true;
        }
        if (type === 'image/gif') {
            return true;
        }
        return false;
    }

}