
const formatTime = require('../../utils/util')
Page({
    data: {
        address:'北京开放大学',
        stuName:'张三丰',
        stuNo:'123123131',
        subject:'药物化学',
        canvasWidth: 0,
        canvasHeight: 0,
        screenWidth: null, //屏幕宽度
        nowTime: formatTime.formatTime(new Date()),
        isPhoto: true,
        position: 'back', //摄像头朝向
        show: false, //
    },
    onLoad() {
        this.getTime()

        this.ctx = wx.createCameraContext()
        wx.getSystemInfo({ //获取屏幕宽度
            success: (res) => {
                this.setData({
                    screenWidth: res.screenWidth
                })
            }
        })

    },
    getTime() { //获取当前时间
        setInterval(() => {
            this.setData({
                nowTime: formatTime.formatTime(new Date())
            })
        }, 1000);
    },
    changePosition() {  //改变摄像头朝向（可以换前置）
        this.data.position == 'back' ? this.setData({
            position: 'front'
        }) : this.setData({
            position: 'back'
        })
    },
    save() { //保存图片
        wx.saveImageToPhotosAlbum({
            filePath: this.data.src,
            success(res) {
                console.log(res)
                wx.showToast({
                    title: '保存成功',
                    icon: 'success',
                    duration: 2000
                })
            },
            fail: err => {
                console.log(err)
                wx.showToast({
                    title: '保存失败',
                    icon: 'error',
                    duration: 2000
                })
            }
        })
    },

    takePhoto() { //拍照
        console.log('takephoto1')
        let that = this
        this.ctx.takePhoto({
            quality: 'high',
            success: (res) => {
                this.setData({
                    src: res.tempImagePath,
                    isPhoto: false,
                })
                console.log('takephoto2');
                wx.getImageInfo({ //获取照片宽高
                    src: res.tempImagePath,
                    success: (ress) => {
                    let ctx = wx.CanvasContext('firstCanvas')
                    that.setData({
                        canvasHeight: ress.height,
                        canvasWidth: ress.width
                    })
                    //将图片src放到cancas内，宽高为图片大小
                    ctx.drawImage(res.tempImagePath, 0, 0, that.data.screenWidth, 500) //五百和界面相机高度一致
                    ctx.setFontSize(14) //注意：设置文字大小必须放在填充文字之前，否则不生效
                    ctx.setFillStyle('white')
                    ctx.fillText(that.data.addressInfo.address, 20, 480)
                        ctx.setFontSize(30) //注意：设置文字大小必须放在填充文字之前，否则不生效
                        ctx.setFillStyle('white')
                        ctx.fillText(that.data.nowTime, 20, 450)
                        ctx.draw(false, function () {
                            wx.canvasToTempFilePath({
                                canvasId: 'firstCanvas',
                                fileType: 'jpg',
                                quality: 1,
                                success: (res1) => {
                                    console.log(res1)
                                    that.setData({
                                        src: res1.tempFilePath
                                    })
                                },
                                fail: (e) => {
                                    console.log(e)
                                }
                            })
                        })
                        this.save()
                    }
                })
            }
        })
    },
    
    error(e) {
        console.log(e.detail)
    }
})