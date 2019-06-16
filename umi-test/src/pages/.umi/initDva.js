import dva from 'dva';
import createLoading from 'dva-loading';

const runtimeDva = window.g_plugins.mergeConfig('dva');
let app = dva({
  history: window.g_history,
  
  ...(runtimeDva.config || {}),
});

window.g_app = app;
app.use(createLoading());
(runtimeDva.plugins || []).forEach(plugin => {
  app.use(plugin);
});

app.model({ namespace: 'cart', ...(require('D:/BaiduNetdiskDownload/开课吧第八期全栈架构师/13课 项目实践/课件/src/models/cart.js').default) });
app.model({ namespace: 'user', ...(require('D:/BaiduNetdiskDownload/开课吧第八期全栈架构师/13课 项目实践/课件/src/models/user.js').default) });
app.model({ namespace: 'goods', ...(require('D:/BaiduNetdiskDownload/开课吧第八期全栈架构师/13课 项目实践/课件/src/pages/goods/models/goods.js').default) });
