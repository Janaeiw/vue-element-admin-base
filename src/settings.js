const baseURL = process.env.VUE_APP_BASE_API

module.exports = {
  // 应用appid
  appId: 'ty9fd2848a039ab554',

  // 应用秘钥
  appSecret: 'ec32286d0718118861afdbf6e401ee81',

  // 配置显示在浏览器标签的title
  appName: '基础框架',

  // api路径
  api: {
    userIco: `${baseURL}/user-ico`,
    otherIco: `${baseURL}/robot-ico`,
    import: `${baseURL}/question-import`
  },

  defaultAvatar: './images/default/face.png',

  /**
   * @type {boolean} true | false
   * @description Whether show the settings right-panel
   */
  showSettings: false,

  /**
   * 全局尺寸设置
   * @type {boolean}
   */
  showSizeSelect: false,

  /**
   * @type {boolean} true | false
   * @description Whether need tagsView
   */
  tagsView: true,

  /**
   * @type {boolean} true | false
   * @description Whether fix the header
   */
  fixedHeader: true,

  /**
   * @type {boolean} true | false
   * @description Whether show the logo
   */
  showLogo: true
}
