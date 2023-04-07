module.exports = {
  title: 'Floating',
  base: '/lgd/',
  themeConfig: {
    logo: '/image/Bear.jpg',
    nav: require('./nav.js'),
    sidebar: require('./sidebar.js'),
    sidebarDepth: 2,
    smoothScroll: true,
    repo: 'https://github.com/Vayne-bit/Vayne-bit',
    repoLabel: 'Github',
  },
  locales: {
    '/': {
      lang: 'zh-CN',
    }
  },
  markdown: {
    lineNumbers: true,
  },
  head: [
    ['link', { rel: 'icon', href: '/image/Bear.ico' }] // 需要被注入到当前页面的 HTML <head> 中的标签
  ],
}