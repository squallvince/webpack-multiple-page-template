/**
 * 全局配置文件
 */
module.exports = {
  // 项目中的html文件，不需要后缀
  ProjectDirs: {
    'pathA': ['index', 'list'],
    'pathB': ['index']
  },
  env: {
    'ci': '//m-static-ci.domain-name.com/',
    'uat': '//m-static-uat.domain-name.com/',
    'prod': '//m-static.domain-name.com/'
  }
}
