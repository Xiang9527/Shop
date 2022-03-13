<script>
import Vue from "vue";
import { BImg, BootstrapVueIcons } from "bootstrap-vue";
import { apiGetProductByID } from "~/api";
Vue.component("b-img", BImg);
Vue.use(BootstrapVueIcons);
export default {
  async asyncData(context) {
    let product = await apiGetProductByID(context.params.id);
    return {
      Product: product.data.Data,
      DisplayImage: product.data.Data.Image.length <= 4
                    ? product.data.Data.Image
                    : product.data.Data.Image.splice(0, 4)
    };
  },
  data() {
    return {
      fullDeduction: {},
      productImages: [],
      selectedImage: "",
      color: "",
      size: "",
      quantity: 0,
      purchaseCount: 0,
    };
  },
  created() {
    this.productImages = this.DisplayImage;
      
    this.productImages.forEach((x, idx) => {
      this.$set(x, "pictureSelected", idx == 0 ? true : false);
    });
    this.Product.AllColor.forEach((x, idx) => {
      this.$set(x, "selected", false);
    });
    this.Product.AllSize.forEach((x, idx) => {
      this.$set(x, "selected", false);
    });
    this.selectedImage = this.productImages[0].URL;
    this.quantity = this.Product.Style.reduce((sum, obj) => {
      return sum + obj.LeftQuantity;
    }, 0);
  },
  mounted() {
    let deliveryList = this.Product.Delivery;
    let filterFullDeduction = deliveryList.filter(
      (x) => x.Price == x.Deduction
    );
    this.fullDeduction =
      filterFullDeduction.length > 0 ? filterFullDeduction[0] : {};
  },
  methods: {
    MouseOverPicture(image) {
      this.selectedImage = image;
      this.productImages.forEach((x) => {
        x.pictureSelected = x.URL == image ? true : false;
      });
    },
    SelectedColor(color) {
      this.Product.AllColor.forEach((x) => {
        x.selected = x == color ? true : false;
      });
      this.color = color.Name;
    },
    SelectedSize(size) {
      this.Product.AllSize.forEach((x) => {
        x.selected = x == size ? true : false;
      });
      this.size = size.Type;
    },
    PurchaseDicide(leftCount) {
      if(leftCount < this.purchaseCount)
      {
        this.purchaseCount = leftCount;
      }
    },
    PurchaseCounting(count) {
      if (!(this.purchaseCount == 0 && count == -1) && !(this.purchaseCount == this.LeftCount && count == 1)) {
        this.purchaseCount += count;
      }
    }
  },
  computed: {
    LeftCount() {
      let color = this.color;
      let size = this.size;
      let filterData = this.Product.Style.filter((x) => {
        return (
          (!this.$common.IsNull(color) ? x.Name == color : true) &&
          (!this.$common.IsNull(size) ? x.Type == size : true)
        );
      });
      let reuslt = filterData.reduce((sum, obj) => {
        return sum + obj.LeftQuantity;
      }, 0);
      return reuslt == 0 ? this.quantity : reuslt;
    },
  },
};
</script>
<template>
  <b-container>
    <b-row>
      <b-col cols="4" sm="4">
        <b-row>
          <div :class="$style.pictureContainer">
            <b-img 
              class="pb-3" 
              style="margin: auto;"
              fluid-grow 
              :src="selectedImage"
              >
            </b-img>
          </div>
        </b-row>
        <b-row>
          <b-col
            class="pl-0"
            cols="3"
            sm="3"
            v-for="image in productImages"
            :key="image.URL"
          >
            <b-img
              :src="image.URL"
              width="80"
              height="80"
              @mouseover="MouseOverPicture(image.URL)"
              :class="{ [$style.pictureBorder]: image.pictureSelected }"
            ></b-img>
          </b-col>
        </b-row>
      </b-col>
      <b-col cols="8" sm="8">
        <b-row>
          <b-col cols="12" sm="12" :class="$style.productTitle">{{
            Product.ProductName
          }}</b-col>
          <b-col class="mb-3" cols="12" sm="12" :class="$style.productPrice">
            ${{ $common.MoneyFormatter(Product.MarketPrice) }}</b-col
          >
          <b-col v-if="Product.Discount.length > 0" cols="3" sm="3">折價</b-col>
          <b-col
            class="mb-3"
            cols="9"
            sm="9"
            v-for="discount in Product.Discount"
            :key="discount.ID"
            >{{ discount.Name }}</b-col
          >
          <b-col cols="3" sm="3" v-if="!$common.IsNull(fullDeduction) && !$common.IsNull(fullDeduction.DeductionCondition)">運送</b-col>
          <b-col class="mb-3" cols="9" sm="9" v-if="!$common.IsNull(fullDeduction) && !$common.IsNull(fullDeduction.DeductionCondition)"
            >滿${{ fullDeduction.DeductionCondition }}，免運費</b-col
          >
          <b-col cols="3" sm="3" v-if="Product.AllColor.length > 0">顏色</b-col>
          <b-col cols="9" sm="9" v-if="Product.AllColor.length > 0" class="mb-3">
            <b-button
              v-for="color in Product.AllColor"
              :key="color.ID"
              variant="outline-primary"
              :class="{ [$style.productBorder]: color.selected }"
              class="mr-3"
              @mouseover="MouseOverPicture(color.Image)"
              @click="SelectedColor(color)"
            >
              {{ color.Name }}
            </b-button>
          </b-col>
          <b-col cols="3" sm="3">尺寸</b-col>
          <b-col cols="9" sm="9" class="mb-3">
            <b-button
              v-for="size in Product.AllSize"
              :key="size.ID"
              variant="outline-primary"
              :class="{ [$style.productBorder]: size.selected }"
              class="mr-3"
              @click="SelectedSize(size)"
            >
              {{ size.Type }}
            </b-button>
          </b-col>
          <!-- #region 選擇商品數量  -->
          <b-col cols="3" class="mb-3">
            <div
              tabindex="-1"
              class="b-form-spinbutton form-control d-flex align-items-stretch"
            >
              <button
                tabindex="-1"
                type="button"
                class="btn btn-sm border-0 rounded-0 py-0"
                @click="PurchaseCounting(-1)"
              >
                <svg viewBox="0 0 16 16" width="1em" height="1em" focusable="false" role="img" aria-label="dash" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="bi-dash b-icon bi">
                  <g transform="translate(8 8) scale(1.25 1.25) translate(-8 -8)">
                    <path d="M4 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 4 8z"></path>
                  </g>
                </svg>
              </button>
              <b-form-input type="number" v-model.number="purchaseCount" :max="LeftCount" min="0" @update="PurchaseDicide(LeftCount)" :class="$style.productCountBorder"></b-form-input>
              <button
                tabindex="-1"
                type="button"
                class="btn btn-sm border-0 rounded-0 py-0"
                @click="PurchaseCounting(1)"
              >
                <svg viewBox="0 0 16 16" width="1em" height="1em" focusable="false" role="img" aria-label="plus" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="bi-plus b-icon bi">
                  <g transform="translate(8 8) scale(1.25 1.25) translate(-8 -8)">
                    <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"></path>
                  </g>
                </svg>
              </button>
            </div>
          </b-col>
          <b-col cols="9">
            <span>還剩{{LeftCount}}件</span>
          </b-col>
          <!-- #endregion -->
          <b-col cols="12" sm="12">
            <b-button variant="outline-primary" @click="$root.$refs.shoppingCart.AddItem(Product.ID, purchaseCount)">
              <b-icon variant="info" icon="cart4"></b-icon>
              放入購物車
            </b-button>
            <b-button variant="outline-primary" class="ml-2">
              <b-icon variant="info" icon="bag-check-fill"></b-icon>
              直接購買
            </b-button>
          </b-col>
        </b-row>
      </b-col>
    </b-row>
    <b-row class="mt-5">
      <b-col cols="12" sm="12" class="pl-0">
        <div :class="$style.productDescription"><h3>商品詳情</h3></div>
        <div v-html="Product.Description"></div>
      </b-col>
    </b-row>
  </b-container>
</template>

<style module>
.pictureBorder {
  border: 2px red solid;
}

.productBorder {
  border: 1px rgb(247, 94, 5) solid;
}

.productTitle {
  font-size: 1.25rem;
}

.productPrice {
  font-size: 1.875rem;
  color: #ee4d2d;
}

.productCountBorder{
  border-bottom:0px;
  border-top:0px;
}

.productDescription{
  background: rgba(0, 0, 0, 0.075)
}

.pictureContainer{
  width: 380px;
  height: 396px;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
