<script>
  import Vue from "vue";
  import { validationMixin } from "vuelidate";
  import { required, minLength } from "vuelidate/lib/validators";
  import {apiPostCheckUser} from "~/api";
  import { BModal, BAlert } from 'bootstrap-vue';
  import moment from 'moment'
  Vue.component('b-modal', BModal);
  Vue.component('b-alert', BAlert);
  export default {
    mixins: [validationMixin],
    data() {
      return {
        form: {
          name: '',
          password: ''
        },
        loginFlag: false,
        dismissCountDown: 0,
        account: "",
        loginTime: ""
      }
    },
    validations: {
      form: {
        name: {
          required,
          minLength: minLength(3)
        },
        password: {
          required
        }
      }
    },
    created (){
      this.$root.$refs.login = this;
      console.log("created");
    },
    mounted (){
      this.account = localStorage.getItem('Account');
      this.loginTime = localStorage.getItem('LoginTime');
    },
    methods: {
      countDownChanged(dismissCountDown) {
        this.dismissCountDown = dismissCountDown
      },
      GetLoginInfo(){
        let obj = {
          loginTime : this.$common.IsNull(this.loginTime) ? "" : this.loginTime,
          account : this.$common.IsNull(this.account) ? "" : this.account
        }
        return obj;
      },
      CheckLogin(){
        let obj = this.GetLoginInfo();
        return ((obj.loginTime == "" && obj.account == "") || (obj.loginTime != "" && this.$moment().diff(obj.loginTime, 'minutes') > 30)) ? false : true;
      },
      UserLoginModal() {
        if (this.$common.IsNull(this.CheckLogin())) {
          this.$bvModal.show('LoginForm');
        }
      },
      checkFormValidity(ref) {
        const { $dirty, $error } = this.$v.form[ref];
        return $dirty ? !$error : null;
      },
      resetModal() {
        this.form.name = "";
        this.form.password = "";

        this.$nextTick(() => {
          this.$v.$reset();
        });
      },
      handleOk(bvModalEvt) {
        bvModalEvt.preventDefault()
        this.handleSubmit()
      },
      handleSubmit() {
        this.$v.form.$touch();
        if (this.$v.form.$anyError) {
          return;
        }

        this.$nextTick(() => {
          apiPostCheckUser(this.form.name, this.form.password).then((response) => {
            this.loginFlag = response.data.Data;
            this.dismissCountDown = 5;
            if (this.loginFlag) {
              this.$bvModal.hide('LoginForm');
              this.$router.go(0);
              localStorage.setItem('Account', this.form.name);
              localStorage.setItem('LoginTime', moment().format('YYYY-MM-DD HH:mm:ss'));
            }
          });
        })
      },
      Logout(){
        localStorage.removeItem('Account');
        localStorage.removeItem('LoginTime');
        this.$router.go(0);
      }
    }
  }
</script>

<template>
  <client-only>
      <div>
      <b-alert
        :show="dismissCountDown"
        dismissible
        :variant="loginFlag ? 'success' : 'danger'"
        @dismissed="dismissCountDown=0"
        @dismiss-count-down="countDownChanged"
      >
        {{ loginFlag ? 'Login Success' : 'Login Fail' }}
      </b-alert>

      <b-modal
        id="LoginForm"
        ref="modal"
        title="Submit Your Account Information"
        @show="resetModal"
        @hidden="resetModal"
        @ok="handleOk"
      >
        <form ref="form" @submit.stop.prevent="handleSubmit">
          <b-form-group
            ref="nameInput"
            label="帳號"
            label-for="name-input"
            invalid-feedback="帳號必填"
            label-cols-lg="3"
            :state="checkFormValidity('name')"
          >
            <b-form-input
              id="name-input"
              v-model="form.name"
              type="text"
            ></b-form-input>
          </b-form-group>

          <b-form-group
            ref="passwordInput"
            label="密碼"
            label-for="password-input"
            invalid-feedback="密碼必填"
            label-cols-lg="3"
            :state="checkFormValidity('password')"
          >
            <b-form-input
              id="password-input"
              v-model="form.password"
              type="password"
            ></b-form-input>
          </b-form-group>
        </form>
      </b-modal>
    </div>
  </client-only> 
</template>