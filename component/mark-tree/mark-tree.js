Component({
    data: {},
    properties: {
        page: {
            type: Array,
            value: [],
        },
        sectionid: {
            type: String,
            value: ''
        }
    },
    methods: {
        //子组件其实也是自己的父组件，所以需要接受这个点击事件，再次进行递归传递
        receivePage(e) {
            this.triggerEvent('tapPage', {
                page: e.detail.page,
                clickQid: e.detail.clickQid,
            });
        },
        // 无小题---单选题，判断题, 主观题
        onechecked(e) {
            const { it, qid } = e.currentTarget.dataset;
            const { page } = this.data;
            page.forEach((pageItem, pageindex) => {
                if (pageItem.qid === qid) {
                    this.setData({
                        [`page[${pageindex}].checked`]: it
                    })
                    this.triggerEvent('tapPage', {
                        page: pageItem,
                        clickQid: qid
                    });
                }
            })

        },
        // 无小题---多选题
        doublechecked(e) {
            const { it, qid } = e.currentTarget.dataset;
            const { page } = this.data;
            page.forEach((pageItem, pageindex) => {
                if (pageItem.qid === qid) {
                    let dataRowArray = pageItem.checked;
                    if (dataRowArray === "" || dataRowArray.indexOf(it) == -1) {
                        dataRowArray = pageItem.checked += it;
                        dataRowArray = dataRowArray.split("").sort();
                        dataRowArray = Array.from(new Set(dataRowArray)).join("");
                    } else {
                        dataRowArray = dataRowArray.split(it).join("");
                    }
                    this.setData({
                        [`page[${pageindex}].checked`]: dataRowArray
                    })
                    this.triggerEvent('tapPage', {
                        page: pageItem,
                        clickQid: qid
                    });
                }
            })
        },
        // 有小题---单选题，判断题,主观题
        onechildchecked(e) {
            const { it, qid, indexarrii } = e.currentTarget.dataset;
            const { page } = this.data;
            // console.log(page)
            page.forEach((items, i) => {
                if (items.qid === qid) {
                    items.children.map((item, j) => {
                        if (j === indexarrii) {
                            this.setData({
                                [`page[${i}]children[${j}].checked`]: it
                            })
                            this.triggerEvent('tapPage', {
                                page: items,
                                clickQid: qid
                            });
                        }
                    })
                }
            })
        },
        // 有小题---多选题
        doublechildchecked(e) {
            const { it, qid, indexarrii } = e.currentTarget.dataset;
            const { page } = this.data;
            // console.log(page)
            page.forEach((items, i) => {
                if (items.qid === qid) {
                    items.children.map((ii, j) => {
                        if (j === indexarrii) {
                            let dataRowArray = ii.checked;
                            if (dataRowArray === "" || dataRowArray.indexOf(it) == -1) {
                                dataRowArray = ii.checked += it;
                                dataRowArray = dataRowArray.split("").sort();
                                dataRowArray = Array.from(new Set(dataRowArray)).join("");
                            } else {
                                dataRowArray = dataRowArray.split(it).join("");
                            }
                            this.setData({
                                [`page[${i}]children[${j}].checked`]: dataRowArray
                            })
                            this.triggerEvent('tapPage', {
                                page: items,
                                clickQid: qid
                            });
                        }
                    })
                }
            })
        },
        seeVideo(e) {
            const { vimg, vsrc, vqid } = e.currentTarget.dataset;
            const { sectionid } = this.data;
            wx.navigateTo({
                url: `/pages/markWrongList/playVideo?type=1&section_id=${sectionid}`,
            })
            const vOptions = {
                vimg: vimg,
                vsrc: vsrc,
                vqid: vqid
            }
            wx.setStorageSync('vOptions', vOptions)
        },
    }
})