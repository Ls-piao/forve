<template>
  <div class="bg" id="login">
    <div class="header">
      <div class="logo">
        <img src="@/assets/images/logo.png" alt="" />
      </div>
      <div class="user_box no_dropdown">
        <el-dropdown :show-timeout="0" placement="bottom">
          <div>
            <div class="user_pic">
              <img
                class="hide-sm"
                :src="photo === '' ? '/static/img/avatar.png' : photo"
              />
            </div>
            <div class="user_info">
              <div class="user_name">{{ userName }}</div>
              <span class="day_time">{{ state }}</span>
            </div>
          </div>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item @click.native="updatePasswordHandle()"
              >修改密码</el-dropdown-item
            >
            <el-dropdown-item @click.native="logoutHandle()"
              >退出</el-dropdown-item
            >
          </el-dropdown-menu>
        </el-dropdown>
        <!--        <div class="user_option">-->
        <!--          <div>修改密码</div>-->
        <!--          <div>退出</div>-->
        <!--        </div>-->
      </div>
    </div>

    <div class="app_box">
      <div class="box_left">
        <div class="box_title">
          <img src="@/assets/images/title_font1.png" alt="" />
        </div>
        <div class="app_content">
          <!--          <div v-bind:class="calcClass(index + 1)"  v-for="(value, index) in allMenuList.slice(0, 7)" @click="routerURL(value)">-->
          <!--            <img :src="require(`../assets/images/icon${index + 1}.png`)" alt="">-->
          <!--            <p>{{ value.name }}</p>-->
          <!--          </div>-->
          <div class="app_item item1">
            <img
              src="@/assets/images/icon1.png"
              alt=""
              @click="hasPerAndRedirect('综合管理')"
            />
            <p>综合管理</p>
          </div>
          <div class="app_item item2">
            <img
              src="@/assets/images/icon2.png"
              alt=""
              @click="hasPerAndRedirect('人事管理')"
            />
            <p>人事管理</p>
          </div>
          <div class="app_item item3">
            <img
              src="@/assets/images/icon3.png"
              alt=""
              @click="hasPerAndRedirect('费控管理')"
            />
            <p>费控管理</p>
          </div>
          <div class="app_item item4">
            <img
              src="@/assets/images/icon4.png"
              alt=""
              @click="hasPerAndRedirect('公文管理')"
            />
            <p>公文管理</p>
          </div>
          <div class="app_item item5">
            <img
              src="@/assets/images/icon5.png"
              alt=""
              @click="hasPerAndRedirect('资产管理')"
            />
            <p>资产管理</p>
          </div>
          <div class="app_item item6">
            <img
              src="@/assets/images/icon6.png"
              alt=""
              @click="hasPerAndRedirect('项目管理')"
            />
            <p>项目管理</p>
          </div>
          <div class="app_item item7">
            <img
              src="@/assets/images/icon7.png"
              alt=""
              @click="hasPerAndRedirect('档案管理')"
            />
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
            <img
              src="@/assets/images/icon8.png"
              alt=""
              @click="hasPerAndRedirect('自然资源监测')"
            />
            <p>自然资源监测</p>
          </div>
          <div class="app_item item9">
            <img
              src="@/assets/images/icon9.png"
              alt=""
              @click="hasPerAndRedirect('生态状况监测')"
            />
            <p>生态状况监测</p>
          </div>
          <div class="app_item item10">
            <img
              src="@/assets/images/icon10.png"
              alt=""
              @click="hasPerAndRedirect('资源资产管理')"
            />
            <p>资源资产管理</p>
          </div>
          <div class="app_item item11">
            <img
              src="@/assets/images/icon11.png"
              alt=""
              @click="hasPerAndRedirect('三维可视化')"
            />
            <p>三维可视化</p>
          </div>
          <div class="app_item item12">
            <img
              src="@/assets/images/icon12.png"
              alt=""
              @click="hasPerAndRedirect('野生动物监测')"
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
    <!-- 弹窗, 修改密码 -->
    <update-password
      v-if="updatePassowrdVisible"
      ref="updatePassowrd"
    ></update-password>
  </div>
</template>

<script>
import { clearLoginInfo, hasPermission } from "@/utils";
import UpdatePassword from "./layout/UpdatePassword";
export default {
  data() {
    return {
      updatePassowrdVisible: false,
      state: "",
      allMenuList: [],
    };
  },
  components: {
    UpdatePassword,
  },
  computed: {
    photo: {
      get() {
        return this.$store.state.user.photo;
      },
    },
    userName: {
      get() {
        return this.$store.state.user.name;
      },
    },
  },
  created() {
    this.allMenuList = JSON.parse(
      sessionStorage.getItem("allMenuList") || "[]"
    );
    this.resize();
  },
  mounted() {
    // this.getUserInfo()
    // this.getConfig()
    // this.getTimeState()
  },
  methods: {
    // 获取当前登录用户信息
    getUserInfo() {
      this.$http({
        url: "/sys/user/info",
        method: "get",
      }).then(({ data }) => {
        if (data.success) {
          this.$store.commit("user/updateUser", data.user);
        }
      });
    },
    // 获取产品name 和 logo
    getConfig() {
      this.$http.get("/sys/sysConfig/getConfig").then(({ data }) => {
        if (data.success) {
          this.$store.commit(
            "config/updateProductName",
            data.config.productName
          );
          this.$store.commit("config/updateLogo", data.config.logo);
          if (!localStorage.getItem("defaultLayout")) {
            this.$store.commit(
              "config/updateDefaultLayout",
              data.config.defaultLayout
            );
          }
          if (!localStorage.getItem("defaultTheme")) {
            this.$store.commit(
              "config/updateDefaultTheme",
              data.config.defaultTheme
            );
          }
        }
      });
    },
    // 页面提示信息
    getTimeState() {
      // 获取当前时间
      let timeNow = new Date();
      // 获取当前小时
      let hours = timeNow.getHours();
      // 设置默认文字
      let state = ``;
      // 判断当前时间段
      if (hours >= 0 && hours <= 10) {
        state = `早上好!`;
      } else if (hours > 10 && hours <= 14) {
        state = `中午好!`;
      } else if (hours > 14 && hours <= 18) {
        state = `下午好!`;
      } else if (hours > 18 && hours <= 24) {
        state = `晚上好!`;
      }
      this.state = state;
    },
    // 修改密码
    updatePasswordHandle() {
      this.updatePassowrdVisible = true;
      this.$nextTick(() => {
        this.$refs.updatePassowrd.init();
      });
    },
    // 退出
    logoutHandle() {
      this.$confirm(`确定进行[退出]操作?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        this.$http({
          url: "/sys/logout",
          method: "get",
        }).then(({ data }) => {
          if (data && data.success) {
            clearLoginInfo();
            if (process.env.VUE_APP_SSO_LOGIN === "true") {
              let service =
                window.location.protocol + "//" + window.location.host + "/";
              window.location.href = `${process.env.VUE_APP_CAS_SERVER}/logout?service=${service}`;
            } else {
              this.$router.replace({ name: "login" });
            }
          }
        });
      });
    },
    // 重设页面大小
    resize() {
      this.tofix();
      window.addEventListener("resize", function () {
        this.tofix();
      });
    },
    // 定义html字体 运行在所有js之前减少闪屏
    tofix() {
      var width =
        document.documentElement.clientWidth > 1366
          ? document.documentElement.clientWidth
          : 1366;
      var rate = (width / 1920) * 100;
      document.querySelector("html").style.fontSize = rate + "px";
    },
    // 判断是否有权限以及页面跳转
    hasPerAndRedirect(val) {
      let data = this.allMenuList.filter(function (item) {
        return item.name === val;
      });
      if (data.length !== 0) {
        if (data[0].permission === "" || hasPermission(data[0].permission)) {
          // 模块名存储到本地来使用
          localStorage.removeItem("modulesName");
          localStorage.removeItem("logoName");
          localStorage.setItem("modulesName", data[0].name);
          localStorage.setItem(
            "logoName",
            "/static/img/" + data[0].name + "系统.png"
          );
          this.$router.push(data[0].href);
          // 移除font-size 样式
          document.querySelector("html").removeAttribute("style");
          // 重新赋值session
          sessionStorage.removeItem("someMenuList");
          sessionStorage.setItem(
            "someMenuList",
            JSON.stringify(data[0].children)
          );
        } else {
          this.$notify.error({
            title: "提示",
            message: "权限不足，请联系管理员",
          });
        }
      } else {
        this.$notify.error({
          title: "提示",
          message: "权限不足，请联系管理员",
        });
      }
    },
  },
};
</script>

<style scoped>
@import "~@/assets/css/main.css";

.no_dropdown >>> .el-dropdown {
  position: relative;
  color: #fff;
  margin-bottom: 36px;
}
@media (max-width: 2000px) and (min-width: 1900px) {
  .app_box {
    margin: 0.2rem auto 0;
  }
}
@media (max-width: 1600px) and (min-width: 1500px) {
  .app_box {
    margin: -0.1rem auto 0;
  }
}
</style>

