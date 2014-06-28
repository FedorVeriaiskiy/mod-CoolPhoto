/*!
 * CoolPhoto photogallery module
 *
 * Date: 2014-5-5
 */

$(function () {
    // set a global coolPhoto gallery identifier
    var coolPhoto = {};

    // set a coolPhoto gallery local variables
    coolPhoto.COOLPHOTO_GALLERY_SRC = [];
    coolPhoto.COOLPHOTO_GALLERY_TITLES = [];
    coolPhoto.curGalleryIndex = '';

    // init coolPhoto gallery
    coolPhoto.initCoolphoto();

    $(window).load(function () {
        coolPhoto.openUrlPhoto();
    });

    coolPhoto.initCoolphoto = function () {
        // add gallery images url's to array
        $('#page_content_main').find('a[rel]').each(function () {
            if ($(this).attr('rel').indexOf('coolPhoto') != -1 && $(this).parent().css('display') != 'none') {
                var curImageGalleryIndex = $(this).attr('rel').replace('coolPhoto[', '').replace(']', ''),
                    curImageSrc = $(this).attr('href'),
                    curImageTitle = $(this).find('img').attr('alt');

                if (!coolPhoto.COOLPHOTO_GALLERY_SRC[curImageGalleryIndex]) {
                    coolPhoto.COOLPHOTO_GALLERY_SRC[curImageGalleryIndex] = [];
                    coolPhoto.COOLPHOTO_GALLERY_TITLES[curImageGalleryIndex] = [];
                }

                coolPhoto.COOLPHOTO_GALLERY_SRC[curImageGalleryIndex].push(curImageSrc);
                coolPhoto.COOLPHOTO_GALLERY_TITLES[curImageGalleryIndex].push(curImageTitle);
            }
        });

        $('a[rel]').click(function () {
            if ($(this).attr('rel').indexOf('coolPhoto') != -1) {
                var curImageGalleryIndex = $(this).attr('rel').replace('coolPhoto[', '').replace(']', ''),
                    curImageSrc = $(this).attr('href');
                coolPhoto.openCoolphoto(curImageGalleryIndex, curImageSrc);
                return false;
            }
        });

        $('.modal-coolPhoto-background').click(function () {
            coolPhoto.closeCoolphoto();
        });

        $('.btn-close-modal').click(function () {
            coolPhoto.closeCoolphoto();
        });

        $('.btn-coolPhoto-prev').click(function () {
            var curImageSrc = $('.modal-coolPhoto').find('img').attr('src');
            coolPhoto.showCoolphotoPrevImage(curImageSrc);
        });

        $('.btn-coolPhoto-next').click(function () {
            var curImageSrc = $('.modal-coolPhoto').find('img').attr('src');
            coolPhoto.showCoolphotoNextImage(curImageSrc);
        });

        // keydown event handler
        $(document).keydown(function (e) {
            var curImageSrc = $('.modal-coolPhoto').find('img').attr('src');

            switch (e.keyCode) {
                case 37:
                    coolPhoto.showCoolphotoPrevImage(curImageSrc);
                    break;
                case 39:
                    coolPhoto.showCoolphotoNextImage(curImageSrc);
                    break;
                case 27:
                    coolPhoto.closeCoolphoto();
                    break;
            }
        });
    };

    // coolPhoto module functions
    coolPhoto.openUrlPhoto = function () {
        // check if URL has a photo-hash and show related photo this case
        if (location.hash.indexOf('cphoto_') != -1) {
            var coolphotoParams = location.hash,
                coolphotoParamsArr,
                coolphotoGalleryIndex,
                coolphotoSrc;

            coolphotoParamsArr = coolphotoParams.replace('#cgal_', '').split('_cphoto_');
            coolphotoGalleryIndex = coolphotoParamsArr[0];
            coolphotoSrc = coolphotoParamsArr[1];

            coolPhoto.openCoolphoto(coolphotoGalleryIndex, coolphotoSrc);

            if (!coolPhoto.checkURLCoolphoto(coolphotoGalleryIndex, coolphotoSrc)) {
                coolPhoto.setCoolphotoSinglePhotoMode();
            }
        }
    };

    coolPhoto.checkURLCoolphoto = function (imageGalleryIndex, imageSrc) {
        var isGalleryExists = false;
        // check if related gallery exists
        if (!coolPhoto.COOLPHOTO_GALLERY_SRC[imageGalleryIndex]) return false;

        for (var i = 0; i < coolPhoto.COOLPHOTO_GALLERY_SRC[imageGalleryIndex].length; i++) {
            if (coolPhoto.COOLPHOTO_GALLERY_SRC[imageGalleryIndex][i] == imageSrc) isGalleryExists = true;
        }
        return isGalleryExists;
    };

    coolPhoto.setCoolphotoSinglePhotoMode = function () {
        $('.modal-coolPhoto').addClass('single-photo');
    };

    coolPhoto.openCoolphoto = function (imageGalleryIndex, imageSrc) {
        coolPhoto.curGalleryIndex = imageGalleryIndex;

        var modalCoolphoto = $('.modal-coolPhoto'),
            modalCoolphotoBackground = $('.modal-coolPhoto-background'),
            fullsizeImage = $('.modal-coolPhoto > img');

        if (modalCoolphoto.hasClass('single-photo')) {
            modalCoolphoto.removeClass('single-photo');
        }

        location.hash = 'cgal_' + imageGalleryIndex + '_cphoto_' + imageSrc;
        fullsizeImage.attr('src', imageSrc);

        var newImage = new Image();
        newImage.src = imageSrc;

        newImage.onload = function () {
            showCoolphoto();
        };

        function showCoolphoto() {
            coolPhoto.setCoolphotoPosition(newImage.naturalWidth, newImage.naturalHeight, 15, 27, 10);
            coolPhoto.setCoolphotoTitle(imageGalleryIndex, imageSrc);
            coolPhoto.setCoolphotoRangePos(imageGalleryIndex, imageSrc);

            modalCoolphoto.fadeIn(0);
            modalCoolphotoBackground.fadeIn(0);

            coolPhoto.setCoolphotoTitleBackground();
        }
    };

    coolPhoto.closeCoolphoto = function () {
        $('.modal-coolPhoto').fadeOut(0);
        $('.modal-coolPhoto-background').fadeOut(0);
        $('.modal-coolPhoto > img').attr('src', '');
        location.hash = '';
    };

    coolPhoto.setCoolphotoPosition = function (imageWidth, imageHeight, modalPaddingWidth, modalPaddingHeight, minModalPadding) {
        var windowWidth = $(window).width(),
            windowHeight = $(window).height(),
            modalWidth = imageWidth + 2 * modalPaddingWidth,
            modalHeight = imageHeight + 2 * modalPaddingHeight,
            oldModalWidth,
            oldModalHeight,
            modalPosTop,
            modalPosLeft;

        // check image size if it's larger than window size and and readjust then
        if (modalWidth >= windowWidth) {
            var adjImageWidth = windowWidth - 2 * modalPaddingWidth - 2 * minModalPadding;
            oldModalWidth = modalWidth;
            oldModalHeight = modalHeight;

            $('.modal-coolPhoto > img').css('width', adjImageWidth);
            modalWidth = adjImageWidth + 2 * modalPaddingWidth;
            modalHeight = modalWidth * oldModalHeight / oldModalWidth;
        } else {
            $('.modal-coolPhoto > img').css('width', 'auto');
        }

        if (modalHeight >= windowHeight) {
            var adjImageHeight = windowHeight - 2 * modalPaddingHeight - 2 * minModalPadding;
            oldModalWidth = modalWidth;
            oldModalHeight = modalHeight;

            $('.modal-coolPhoto > img').css('height', adjImageHeight);
            modalHeight = adjImageHeight + 2 * modalPaddingHeight;
            modalWidth = modalHeight * oldModalWidth / oldModalHeight;
        } else {
            $('.modal-coolPhoto > img').css('height', 'auto');
        }

        // adjust modal block position
        modalPosTop = (windowHeight - modalHeight) / 2 + 'px';
        modalPosLeft = (windowWidth - modalWidth) / 2 + 'px';

        $('.modal-coolPhoto').css({'top': modalPosTop, 'left': modalPosLeft});
    };

    coolPhoto.getCoolphotoCurIndex = function (imageGalleryIndex, imageSrc) {
        var curGallery = coolPhoto.COOLPHOTO_GALLERY_SRC[imageGalleryIndex],
            photoPos;
        for (var i = 0; i < curGallery.length; i++) {
            if (curGallery[i] == imageSrc) {
                photoPos = i;
            }
        }
        return photoPos;
    };

    coolPhoto.setCoolphotoTitle = function (imageGalleryIndex, imageSrc) {
        var coolphotoTitle = $('.coolPhoto-title');
        // clean an old title
        coolphotoTitle.text('');
        var curGalleryTitles = coolPhoto.COOLPHOTO_GALLERY_TITLES[imageGalleryIndex],
            coolphotoPos = coolPhoto.getCoolphotoCurIndex(imageGalleryIndex, imageSrc);
        if (curGalleryTitles[coolphotoPos] != '') {
            coolphotoTitle.text(curGalleryTitles[coolphotoPos]);
        }
    };

    coolPhoto.setCoolphotoTitleBackground = function () {
        // hide coolPhoto title background
        $('.coolPhoto-title-background').css('height', '0');

        var coolphotoTitle = $('.coolPhoto-title');
        if (coolphotoTitle.text() != '') {
            var coolphotoTitleHeight = coolphotoTitle.height() + 30 + 'px';
            $('.coolPhoto-title-background').css('height', coolphotoTitleHeight);
        }
    };

    coolPhoto.setCoolphotoRangePos = function (imageGalleryIndex, imageSrc) {
        var curGallery = coolPhoto.COOLPHOTO_GALLERY_SRC[imageGalleryIndex],
            coolphotoPos = coolPhoto.getCoolphotoCurIndex(imageGalleryIndex, imageSrc) + 1,
            coolphotoAmount = curGallery.length,
            coolphotoRangePos = 'Photo <b>' + coolphotoPos + '</b> from <b>' + coolphotoAmount + '</b>';
        $('.coolPhoto-range-pos').html(coolphotoRangePos);
    };

    coolPhoto.showCoolphotoNextImage = function (curImageSrc) {
        var curGallery = coolPhoto.COOLPHOTO_GALLERY_SRC[curGalleryIndex],
            curImageIndex = coolPhoto.getCoolphotoCurIndex(curGalleryIndex, curImageSrc),
            nextImageIndex,
            nextImageSrc;

        if (curImageIndex == curGallery.length - 1) {
            nextImageIndex = 0;
        } else {
            nextImageIndex = parseInt(curImageIndex) + 1;
        }
        nextImageSrc = curGallery[nextImageIndex];
        coolPhoto.openCoolphoto(coolPhoto.curGalleryIndex, curGallery[nextImageIndex]);
    };

    coolPhoto.showCoolphotoPrevImage = function (curImageSrc) {
        var curGallery = coolPhoto.COOLPHOTO_GALLERY_SRC[coolPhoto.curGalleryIndex],
            curImageIndex = coolPhoto.getCoolphotoCurIndex(coolPhoto.curGalleryIndex, curImageSrc),
            prevImageIndex,
            prevImageSrc;

        if (curImageIndex == 0) {
            prevImageIndex = curGallery.length - 1;
        } else {
            prevImageIndex = parseInt(curImageIndex) - 1;
        }

        prevImageSrc = curGallery[prevImageIndex];
        coolPhoto.openCoolphoto(coolPhoto.curGalleryIndex, curGallery[prevImageIndex]);
    };
});
