const INPUT_NUM = 8;//车牌号输入框个数
const EmptyArray = new Array(INPUT_NUM).fill('');//['','','','','','','','']

// 车牌输入框的下标
const INPUT_INDEX = {
    FIRST: 0,
    SECOND: 1,
    COLOR: 7,
};

Component({
    /**
     * 组件的属性列表
     */
    properties: {
        carNum: {
            type: String,
            value: ''
        },
        // 是否需要输入颜色
        inputColor: {
            type: Boolean,
            value: false,
        }
    },

    data: {
        // 键
        provinceArr: ['京', '沪', '津', '苏', '粤', '冀', '晋', '蒙', '辽', '吉', '黑', '浙', '皖', '闽', '赣', '鲁', '豫', '鄂', '湘',
            '桂', '琼', '渝', '川', '贵', '云', '藏', '陕', '甘', '青', '宁', '新', '港', '澳', '台'],
        strArrOne: ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'P'],
        strArrTwo: ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
        strArrThree: ['Z', 'X', 'C', 'V', 'B', 'N', 'M'],
        numArr: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
        colorArr: ['黄', '蓝', '绿'],
        hiddenPro: false, // 隐藏省份键盘
        hiddenStr: true, // 隐藏数字字母键盘
        hiddenCol: true, // 隐藏颜色键盘
        carNumArr: EmptyArray,
        carNumLen: INPUT_NUM,
        selectInputIndex: 0,
        btnDisabled: true,
        inputColor: false, // 是否需要输入车牌颜色
        carNum: '',

    },
    methods: {
        proTap(e) { //点击省份
            let province = e.currentTarget.dataset.province;
            const { carNumArr, selectInputIndex } = this.data;
            carNumArr[selectInputIndex] = province;
            // 选择车牌号时触发
            this.setData({
                carNumArr,
                // 选中一个后，下一个输入框聚焦
                selectInputIndex: selectInputIndex !== carNumArr.length - 1 ? selectInputIndex + 1 : selectInputIndex,
                btnDisabled: this.btnDisabled()
            });
            this.switchKeyboard(this.data.selectInputIndex);
        },
        strTap(e) { //点击字母数字
            const str = e.currentTarget.dataset.str;
            const { carNumArr, selectInputIndex } = this.data;
            carNumArr[selectInputIndex] = str;
            this.setData({
                carNumArr,
                // 选中一个后，下一个输入框聚焦
                selectInputIndex: selectInputIndex !== carNumArr.length - 1 ? selectInputIndex + 1 : selectInputIndex,
                btnDisabled: this.btnDisabled()
            });
            this.switchKeyboard(this.data.selectInputIndex);
        },
        colorTap(e) {
            let color = e.currentTarget.dataset.color;
            const { carNumArr, selectInputIndex } = this.data;
            carNumArr[selectInputIndex] = color;
            // 选择车牌号时触发
            this.setData({
                carNumArr,
                // 选中一个后，下一个输入框聚焦
                selectInputIndex: selectInputIndex !== carNumArr.length - 1 ? selectInputIndex + 1 : selectInputIndex,
                btnDisabled: this.btnDisabled()
            });
            this.switchKeyboard(this.data.selectInputIndex);
        },
        inputCarNum(e) {
            const { index } = e.currentTarget.dataset;
            this.setData({
                showCarKeyboard: true,
                selectInputIndex: index
            });
            this.switchKeyboard(index);
        },
        switchKeyboard(index) {
            if (index === INPUT_INDEX.FIRST) {
                // 第一个输入框展示省份键盘，第二个展示字母数字输入框(数字不可点),以后就是数字字母输入框(都可点)
                this.setData({
                    hiddenPro: false,
                    hiddenStr: true,
                    hiddenCol: true,
                });
            } else if (index === INPUT_INDEX.SECOND) {
                this.setData({
                    hiddenPro: true,
                    hiddenStr: false,
                    hiddenCol: true,
                });
            } else if (this.data.inputColor && index === INPUT_INDEX.COLOR) {
                this.setData({
                    hiddenPro: true,
                    hiddenStr: true,
                    hiddenCol: false,
                });
            } else {
                this.setData({
                    hiddenPro: true,
                    hiddenStr: false,
                    hiddenCol: true,
                });
            }
        },
        backSpace() { //删除
            let { carNumArr, selectInputIndex } = this.data;
            if (!carNumArr[selectInputIndex]) {
                selectInputIndex = selectInputIndex !== INPUT_INDEX.FIRST ? selectInputIndex - 1 : selectInputIndex;
            }
            carNumArr[selectInputIndex] = '';
            this.setData({
                carNumArr, selectInputIndex,
                btnDisabled: this.btnDisabled()
            }, () => {
                this.switchKeyboard(this.data.selectInputIndex)
            });
        },
        // 只有输入内容的车牌号位数合法时，展示确认按钮
        btnDisabled() {
            const { carNumArr, inputColor } = this.data;
            const disabled = carNumArr.some((item, index) => {
                // 需要输入颜色，所有位都不能为空
                if (inputColor) {
                    return !item;
                }

                // 不需要输入车牌，最后一位可空
                if (index !== carNumArr.length - 1) {
                    return !item;
                }
                return false;
            });
            return disabled;
        },
        onCancel() {
            this.setData({ carNumArr: EmptyArray });
            this.triggerEvent('onCancel');
        },
        onOk() {
            const carNum = this.data.carNumArr.join('');
            this.triggerEvent('onOk', carNum);
        },


        init() {
            const { carNum } = this.properties;
            // console.log('carNum', carNum);
            if (carNum) {
                let carNumArr = carNum.match(/./g);
                // console.log('carNumArr', carNumArr);

                const EmptyArray = new Array(INPUT_NUM - carNumArr.length).fill('');
                carNumArr = carNumArr.concat(EmptyArray);
                // console.log('carNumArr', carNumArr);

                this.setData({ carNumArr }, () => {
                    this.setData({
                        btnDisabled: this.btnDisabled()
                    })
                });
            }
        },

    },

    lifetimes: {
        attached: function () {
            // 在组件实例进入页面节点树时执行
            this.init();
        },
        detached: function () {
            // 在组件实例被从页面节点树移除时执行
        },
    },

    // 以下是旧式的定义方式，可以保持对 <2.2.3 版本基础库的兼容
    attached: function () {
        // 在组件实例进入页面节点树时执行
        this.init();
    },
    detached: function () {
        // 在组件实例被从页面节点树移除时执行
    },
});
