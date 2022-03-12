<script>
import Vue from "vue";
import { BNavbar, BootstrapVueIcons,BLink,BPopover } from "bootstrap-vue";
Vue.component("b-navbar", BNavbar);
Vue.component('b-link', BLink);
Vue.component('b-popover', BPopover);
Vue.use(BootstrapVueIcons);
import ShoppingCart from "../components/ShoppingCart.vue";


export default {
  components:{
    ShoppingCart
  },
  data() {
    return {};
  },
  methods:{
  }
};
</script>
<template>
  <div class="header-top">
    <b-row class="mr-0">
      <b-col cols="3" offset="9" sm="3" offset-sm="9">
        <template v-if="!$root.$refs.login.CheckLogin()">
          <b-link href="#" class="operationELE" @click="$root.$refs.login.UserLoginModal()">登入</b-link>
        </template>
        <template v-else>
          <span id="account" class="operationELE">{{($root.$refs.login.GetLoginInfo()).account}}</span>
          <b-popover target="account" triggers="hover" placement="right">
            <a href="#" class="userDropdown">購買清單</a>
            <a href="#" class="userDropdown" @click="$root.$refs.login.Logout()">登出</a>
          </b-popover>
        </template>
      </b-col>
    </b-row>
    <b-container>
      <b-navbar toggleable="md">
        <b-navbar-brand href="/">
          <b-iconstack font-scale="1.5">
            <b-icon stacked icon="octagon" variant="info"></b-icon>
            <b-icon stacked icon="slack" variant="primary" scale="0.75"></b-icon>
          </b-iconstack>
          <span id="title">Nuxt Shop</span>
        </b-navbar-brand>

        <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

        <b-collapse id="nav-collapse" is-nav>
          <b-navbar-nav class="navbar-center">
            <b-nav-form>
              <b-form-input
                size="sm"
                class="mr-sm-2 mr-lg-6 searchInput"
                placeholder="Search"
              ></b-form-input>
              <b-button size="sm" class="my-2 my-sm-0" variant="info" type="submit"
                ><b-icon icon="search" variant="white"></b-icon
              ></b-button>
              <div>
                <b-icon id="shoppingCart" variant="info" icon="cart-fill" class="shoppingCart"></b-icon>
                <ShoppingCart ref="shoppingCart"/>
              </div>
            </b-nav-form>
          </b-navbar-nav>
          
        </b-collapse>
      </b-navbar>
    </b-container>
  </div>
</template>

<style scoped lang="scss">
  .searchInput {
    width: 400px;
  }
  .header-top {
    background-color: rgb(224, 98, 14);
    margin-bottom: 30px;
    #title {
      color: #fff;
    }
  }
  .navbar-center {
    position: absolute;
    left: 50%;
    transform: translatex(-50%);
  }
  .operationELE{
    color: white;
  }
  .userDropdown{
    color: black;
    text-decoration:none; 
    cursor:pointer;  
    width:80px;
    height: 30px;
    display: flex;
    &:hover{
      color: #00bfa5
    }
  }
  .shoppingCart{
    font-size: 2rem;
    cursor: pointer;
  }

  @media (max-width: 1199px) {
    .searchInput {
      width: 80%;
    }

    .form-inline{
      width: 600px;
    }
  }
</style>