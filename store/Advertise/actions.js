import {apiGetAdvertiseCarouselType} from "../../api";
export default {
    async getCarouselData({commit}) {
        let {data} = await apiGetAdvertiseCarouselType();
        commit("setCarouselData", data.Data.ImageUrls); 
        // this.$notify({
        //     group: 'advertise',
        //     title: '成功取得資料',
        //     text: `資料比數${data.Data.length}`
        //   });
        return data.Data.ImageUrls;
    }
};