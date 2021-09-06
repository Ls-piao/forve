<template>
  <div class="bg" id="login">
    <div class="header">
      <div class="logo">
        <img src="@/assets/images/logo.png" alt="" />
      </div>
      <div class="user_box notlogin" @click="showLogin(0)">
        <div class="user_pic">
          <img src="@/assets/images/login_icon.png" alt="" />
        </div>
        <div class="user_info">
          <div class="user_name">请登录</div>
        </div>
      </div>
    </div>

    <div class="app_box">
      <div class="box_left">
        <div class="box_title">
          <img src="@/assets/images/title_font1.png" alt="" />
        </div>
        <div class="app_content">
          <div class="app_item item1">
            <img src="@/assets/images/icon1.png" alt="" @click="showLogin(0)" />
            <p>综合管理</p>
          </div>
          <div class="app_item item2">
            <img src="@/assets/images/icon2.png" alt="" @click="showLogin(0)" />
            <p>人事管理</p>
          </div>
          <div class="app_item item3">
            <img src="@/assets/images/icon3.png" alt="" @click="showLogin(0)" />
            <p>费控管理</p>
          </div>
          <div class="app_item item4">
            <img src="@/assets/images/icon4.png" alt="" @click="showLogin(0)" />
            <p>公文管理</p>
          </div>
          <div class="app_item item5">
            <img src="@/assets/images/icon5.png" alt="" @click="showLogin(0)" />
            <p>资产管理</p>
          </div>
          <div class="app_item item6">
            <img src="@/assets/images/icon6.png" alt="" @click="showLogin(0)" />
            <p>项目管理</p>
          </div>
          <div class="app_item item7">
            <img src="@/assets/images/icon7.png" alt="" @click="showLogin(0)" />
            <p>档案管理</p>
          </div>
        </div>
      </div>
      <div class="box_right">
        <div class="box_title">
          <img src="@/assets/images/title_font2.png" alt="" />
        </div>
        <div class="app_content">
          <div class="app_item item8">
            <img src="@/assets/images/icon8.png" alt="" @click="showLogin(0)" />
            <p>自然资源监测</p>
          </div>
          <div class="app_item item9">
            <img src="@/assets/images/icon9.png" alt="" @click="showLogin(0)" />
            <p>生态状况监测</p>
          </div>
          <div class="app_item item10">
            <img
              src="@/assets/images/icon10.png"
              alt=""
              @click="showLogin(0)"
            />
            <p>资源资产管理</p>
          </div>
          <div class="app_item item11">
            <img
              src="@/assets/images/icon11.png"
              alt=""
              @click="showLogin(0)"
            />
            <p>三维可视化</p>
          </div>
          <div class="app_item item12">
            <img
              src="@/assets/images/icon12.png"
              alt=""
              @click="showLogin(0)"
            />
            <p>野生动物监测</p>
          </div>
        </div>
      </div>
    </div>

    <div class="footer">
      <div class="company_name">版权所有：东北虎豹国家公园管理局</div>
      <div class="download">
        下载App
        <div class="erweima">
          <img src="@/assets/images/erweima.png" alt="" />
        </div>
      </div>
    </div>

    <transition name=".el-zoom-in-top">
      <div class="login_box" v-show="isShow">
        <div class="close" @click="showLogin(1)"></div>
        <div class="login_form">
          <div class="form_title">用户登录</div>
          <div class="form_subtitle">请使用账号密码登录</div>
          <el-form
            size="small"
            ref="inputForm"
            :model="inputForm"
            :rules="rules"
            class="login-form customize"
            @keyup.enter.native="login()"
            @submit.native.prevent
          >
            <div class="form_box">
              <div class="form_item account">
                <input
                  v-model="inputForm.username"
                  type="text"
                  placeholder="请输入您的账号"
                  style="font-size: 20%"
                />
              </div>
              <div class="form_item pwd">
                <input
                  v-model="inputForm.password"
                  type="password"
                  placeholder="请输入您的密码"
                  style="font-size: 20%"
                />
              </div>
              <div class="form_option" style="margin-bottom: 26px">
                <label class="remember_pwd" for="remember_pwd"
                  ><input type="checkbox" id="remember_pwd" /><span
                    >记住密码</span
                  ></label
                >
                <div class="forget_pwd">
                  <a href="javascript:;">忘记密码?</a>
                </div>
              </div>
              <el-button
                type="primary"
                class="login"
                @click="login"
                :loading="loading"
                >登 录</el-button
              >
            </div>
          </el-form>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  name: "login.vue",
  data() {
    return {
      isShow: false,
      loading: false,
      inputForm: {
        username: "admin",
        password: "admin",
        uuid: "",
        captcha: "",
      },
      rules: {
        username: [
          { required: true, message: "帐号不能为空", trigger: "blur" },
        ],
        password: [
          { required: true, message: "密码不能为空", trigger: "blur" },
        ],
        captcha: [
          { required: true, message: "验证码不能为空", trigger: "blur" },
        ],
      },
      captchaPath: "",
    };
  },
  created() {
    this.resize();
  },
  methods: {
    // 提交表单
    login() {
      this.$cookie.set("token", "12312asdasd123123asdasd");
      this.$cookie.set("refreshToken", "12312asdasdasdasd");
      this.$router.push({ name: "index" });
      // this.$refs['inputForm'].validate((valid) => {
      //   if (valid) {
      //     this.loading = true
      //     this.$http({
      //       url: '/sys/login',
      //       method: 'post',
      //       data: {
      //         'userName': this.inputForm.username,
      //         'password': this.inputForm.password
      //       }
      //     }).then(({data}) => {
      //       if (data && data.success) {
      //         this.$cookie.set('token', data.token)
      //         this.$cookie.set('refreshToken', data.refreshToken)
      //         this.$router.push({name: 'index'})
      //         // this.$notify.success({
      //         //   title: '成功',
      //         //   message: '登陆成功'
      //         // })
      //         // this.loading = false
      //       } else {
      //         this.loading = false
      //         // this.getCaptcha()
      //       }
      //     })
      //   }
      // })
    },
    // 获取验证码
    getCaptcha() {
      this.captchaPath = this.$http.BASE_URL + `/captcha.jpg`;
    },
    // 控制登录页面显示隐藏
    showLogin(flag) {
      this.isShow = flag === 0;
    },
    resize() {
      this.tofix();
      window.addEventListener("resize", function () {
        // this.tofix()
      });
    },
    // 定义html字体 运行在所有js之前减少闪屏
    tofix() {
      var width =
        document.documentElement.clientWidth > 1366
          ? document.documentElement.clientWidth
          : 1366;
      var rate = (width / 1920) * 100;
      console.log(width + "width");
      console.log(rate + "rate");
      document.querySelector("html").style.fontSize = rate + "px";
    },
  },
};
</script>

<style scoped>
@import "~@/assets/css/main.css";

.customize >>> .el-button {
  display: block;
}
</style>

