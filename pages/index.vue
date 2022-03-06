<script>
import Vue from "vue";
import { BCarousel, BCard } from "bootstrap-vue";
import {
  apiGetAdvertiseCarouselType,
  apiGetAllProductType,
  apiGetProductByType,
} from "~/api";
import {MoneyFormatter} from "../assets/common.js";
Vue.component("b-carousel", BCarousel);
Vue.component("b-card", BCard);
export default {
  async asyncData(context) {
    let images = await apiGetAdvertiseCarouselType("Carousel");
    let rightImages = await apiGetAdvertiseCarouselType("CarouselRight");
    let productTypes = await apiGetAllProductType();
    let productByTypes = await apiGetProductByType("MenDress");
    let productList = productByTypes.data.Data.map((x) => {
      var result = {
        ID: x.ID,
        ProductName: x.ProductName,
        MarketPrice: x.MarketPrice,
        Quantity: x.Quantity,
        Discount:
          x.Discount.length > 0
            ? x.Discount[0].DeductionType == "P"
              ? `${x.Discount[0].Deduction}折`
              : ""
            : "",
        Image: x.Image.length > 0 ? x.Image[0].URL : "",
      };
      return result;
    });
    return {
      carouselPictures: images.data.Data.ImageUrls,
      carouselRightPictures: rightImages.data.Data.ImageUrls,
      types: productTypes.data.Data,
      productList,
    };
  },
  data() {
    return {
      carouselPictures: [],
      carouselRightPictures: [],
      slide: 0,
      currentType: "",
    };
  },
  created() {
    this.currentType = this.types.length > 0 ? this.types[0].Description : ""
    this.types.forEach((x, idx) => {
      this.$set(x, "selected", idx == 0 ? true : false);
    });
    this.productList.forEach((x, idx) => {
      this.$set(x, "selected", false);
    });
  },
  methods: {
    MoneyFormatter,
    handleClick() {
      this.$notify({
        group: "Product",
        title: "Important message",
        text: "Hello user! This is a notification!",
      });
    },
    SelectedType(type) {
      this.types.forEach((x, idx) => {
        x.selected = x == type ? true : false;
      });
    },
    UnSelectedType() {
      this.types.forEach((x, idx) => {
        x.selected = false;
      });
    },
    SelectedProduct(product) {
      this.productList.forEach((x, idx) => {
        x.selected = x == product ? true : false;
      });
    },
    UnSelectedProduct() {
      this.productList.forEach((x, idx) => {
        x.selected = false;
      });
    },
    async GetProductByType(type) {
      let typeData = await apiGetProductByType(type.Type)
      this.productList = typeData.data.Data.map((x) => {
        var result = {
          ID: x.ID,
          ProductName: x.ProductName,
          MarketPrice: x.MarketPrice,
          Quantity: x.Quantity,
          Discount:
            x.Discount.length > 0
              ? x.Discount[0].DeductionType == "P"
                ? `${x.Discount[0].Deduction}折`
                : ""
              : "",
          Image: x.Image.length > 0 ? x.Image[0].URL : "",
        };
        return result;
      });
      this.productList.forEach((x, idx) => {
        this.$set(x, "selected", false);
      });
      this.currentType = type.Description;
    }
  },
};
</script>
<template>
  <b-container>
    <b-row class="rowMargin">
      <b-col cols="8">
        <b-carousel
          class="caroselLeft"
          v-model="slide"
          :interval="3000"
          controls
          fade
          indicators
          img-width="1024"
          img-height="480"
          fluid
        >
          <b-carousel-slide
            v-for="picture in carouselPictures"
            :key="picture.id"
            :img-src="picture"
            img-height="480"
            img-width="1024"
          >
          </b-carousel-slide>
        </b-carousel>
      </b-col>
      <b-col cols="4">
        <b-row>
          <b-col class="caroselRightCol" cols="12">
            <b-img class="caroselRight" :src="carouselRightPictures[0]"></b-img>
          </b-col>
          <b-col class="caroselRightCol" cols="12">
            <b-img class="caroselRight" :src="carouselRightPictures[1]"></b-img>
          </b-col>
        </b-row>
      </b-col>
    </b-row>
    <b-row>
      <b-container>
        <b-col cols="12" no-gutters="true">
          <b-card header="分類" header-tag="header">
            <b-card-text>
              <b-row>
                <b-col 
                cols="2" 
                v-for="type in types" :key="type.Type">
                  <b-card 
                  img-alt="Card image" 
                  body-class="text-center"
                  class="productLink"
                  @mouseover="SelectedType(type)" 
                  @mouseout="UnSelectedType()"
                  :style="type.selected ? 'border: 1px rgb(247, 94, 5) solid;' : 'border: 1px white solid;'"
                  @click="GetProductByType(type)">
                    <b-card-img
                      :src="type.URL"
                      class="typePicture"
                      top
                    ></b-card-img>
                    <b-card-text>
                      {{ type.Description }}
                    </b-card-text>
                  </b-card>
                </b-col>
              </b-row>
            </b-card-text>
          </b-card>
        </b-col>
      </b-container>
    </b-row>
    <b-row>
      <b-container>
        <b-col cols="12" no-gutters="true">
          <b-card :header="currentType" header-tag="header">
            <b-card-text>
              <b-row>
                <b-col
                  cols="2"
                  v-for="product in productList"
                  :key="product.ID"
                >
                  <nuxt-link class="productLink" :to="'/product/' + product.ID">
                    <b-card 
                    img-alt="Card image" 
                    body-class="text-left productBlock" 
                    @mouseover="SelectedProduct(product)" 
                    @mouseout="UnSelectedProduct()"
                    :style="product.selected ? 'border: 1px rgb(247, 94, 5) solid;' : 'border: 1px white solid;'"
                    >
                      <b-card-img
                        :src="product.Image"
                        class=""
                        top
                      ></b-card-img>
                      <b-card-text>
                        <div class="productName">{{ product.ProductName }}</div>
                        <div class="productTag" style="color: rgb(246, 145, 19)">
                          <div
                            class=""
                            style="
                              color: white;
                              background-color: rgb(246, 145, 19);
                            "
                          >
                            {{ product.Discount }}
                          </div>
                        </div>
                        <div
                            class=""
                            style="
                              color: red;
                            "
                          >
                        ${{ MoneyFormatter(product.MarketPrice)}}
                        </div>
                      </b-card-text>
                    </b-card>
                  </nuxt-link>
                </b-col>
              </b-row>
            </b-card-text>
          </b-card>
        </b-col>
      </b-container>
    </b-row>
  </b-container>
</template>

<style scoped lang="scss">
.caroselLeft {
  padding-left: 15px;
}
.caroselRightCol {
  padding-left: 0px;
}
.caroselRight {
  height: 105px;
  width: auto;
}
.rowMargin {
  margin-bottom: 30px;
}
.typePicture {
  width: 106px;
  height: 106px;
}
.productTag{
  display: flex;
  justify-content: flex-start;
  flex-wrap: nowrap;
  flex-direction: row;
  height: 1.5rem;
}
.productBlock{
  padding:0.5rem;
}
.productLink{
  text-decoration: none;
  color: black;
  cursor: pointer;
}
.productName {
  text-align: justify;
  padding: 1px 1px 1px 1px;
  text-overflow: ellipsis;
  display: -webkit-box;
  overflow: hidden;
  -webkit-line-clamp:5;
  -webkit-box-orient: vertical;
}
</style>
