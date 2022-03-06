<script>
  import Vue from "vue";
  import { apiGetProductByID } from "~/api";
  import { BPopover } from "bootstrap-vue";
  Vue.component('b-popover', BPopover);
  export default {
    data() {
      return {
        products: []
      }
    },
    created (){
      this.$root.$refs.shoppingCart = this;
    },
    computed:{
      productLength (){
        return this.$root.$refs.login.CheckLogin() ? this.products.length : 0;
      }
    },
    mounted (){
      this.products = this.$common.IsNull(JSON.parse(localStorage.getItem('CartProduct'))) ? [] : JSON.parse(localStorage.getItem('CartProduct'))
    },
    methods: {
      async AddItem(id, count){
        this.$root.$refs.login.UserLoginModal();

        let cartProduct = this.$common.IsNull(JSON.parse(localStorage.getItem('CartProduct'))) ? [] : JSON.parse(localStorage.getItem('CartProduct'));
        let apiProduct = await apiGetProductByID(id);
        let tempProduct = apiProduct?.data?.Data;
        if (tempProduct.ID > 0 && count > 0) {
          let tempIndex = cartProduct.map((x) => {return x.ID;}).indexOf(id);
          if (tempIndex >= 0) {
            cartProduct[tempIndex].Count += count;
          }else{
            cartProduct.push({
              "ID": tempProduct.ID,
              "ProductName": tempProduct.ProductName,
              "MarketPrice": tempProduct.MarketPrice,
              "Image": tempProduct.Image.length > 0 ? tempProduct.Image[0].URL : "",
              "Count": count
            });
          }
          
          localStorage.setItem('CartProduct', JSON.stringify(cartProduct));
        }
        this.products = cartProduct;
      },
      RemoveItem(id){
        let cartProduct = this.$common.IsNull(JSON.parse(localStorage.getItem('CartProduct'))) ? [] : JSON.parse(localStorage.getItem('CartProduct'));
        if (id > 0) {
          let deleteIndex = cartProduct.map( (item) => {return item.ID}).indexOf(id);
          cartProduct.splice(deleteIndex, 1);
          
          localStorage.setItem('CartProduct', JSON.stringify(cartProduct));
        }
        this.products = cartProduct;
      }
    }
  }
</script>

<template>
  <div class="shoppingCartDiv" :data-count="productLength">
    <b-popover target="shoppingCart" triggers="hover" placement="bottom">
      <template v-if="products.length > 0 && $root.$refs.login.CheckLogin()">
        <div v-for="product in products" :key="product.ID" class="productFlex">
          <nuxt-link :to="'/product/' + product.ID" class="productBackground userDropdown productFlex productLink">
            <div class="imageDiv ml-1">
              <b-card-img
              :src="product.Image"
              ></b-card-img>
            </div>
            <div class="productName ml-1">
              {{product.ProductName}}
            </div>
            <div class="ml-2">
              ${{ $common.MoneyFormatter(product.MarketPrice) }}
            </div>
          </nuxt-link>
          <div class="trashIcon ml-3">
            <b-icon variant="secondary" icon="trash-fill" @click="RemoveItem(product.ID)"></b-icon>
          </div>
        </div>
      </template>
      <template v-else>
        <div class="emptyProduct">
          尚無商品
        </div>
      </template>
    </b-popover>
  </div>
</template>

<style scope>
  .emptyProduct{
    display: flex;
    justify-content: center;
    align-items: center; 
    width: 300px;
    height: 300px;
    max-width: 100%;
    max-height: 100%;
  }

  .productName{
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }

  .productLink{
    text-decoration: none;
    color: black;
  }

  .productLink:hover{
    text-decoration: none;
    color: black;
  }

  .productBackground:hover{
    background: rgb(240, 232, 232);
  }

  .productFlex{
    display: flex;
    justify-content: space-around;
    align-items:center;
    padding-top: 10px;
    padding-bottom: 10px;
  }

  .imageDiv{
    max-width:40px;
    max-height:40px;
  }

  .shoppingCartDiv::after{
    content: attr(data-count);
    color: rgb(224, 98, 14);
    position: relative;
    left:-10px;
    top: -10px;
    background-color: #fff;
    border-radius: 2.75rem;
    width: 20px;
    height: 20px;
    display: flex;
    justify-content: space-around;
    align-items:center;
  }

  .trashIcon{
    cursor: pointer;
  }
</style>