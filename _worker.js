
//1、天书版5.0终极版_多优选_Clash防DNS、WebRTC泄漏_TLS_worker
//2、支持反代开关，私钥开关，全局分段开关，订阅隐藏开关功能，去除UUID限制，clash私钥防止被薅请求数
//3、又再重新修改了接口关闭逻辑，降低请求数（请求数大幅度降低）和错误率（worker引发异常为0，至少我测试的是）
//4、修改传输方式，增加分片传输，可提升传输稳定性
//5、支持SOCKS5，支持外部环境变量，变量名【SOCKS5】，只支持一个SOCKS5，并且SOCKS5和原始反代只能二选一，建议有稳定SOCKS5的人使用，白嫖玩家不建议使用，为了方便切换增加了一个外部变量【SOCKS5OPEN】，true打开和false关闭
//6、支持多反代，支持外部环境变量，变量名【PROXYIP】，每行一个，无限尝试逻辑（WORKER响应都是毫秒级的，几乎感觉不到反代切换的影响），直到连上了或者所有反代都无效，优先次序是【脚本内部定义的反代IP--外部环境变量定义的PROXYIP】
//7、多反代功能很方便，但前提是你的反代质量必须得好，可以把自己收集来的各路靠谱大佬的反代都丢进去，除非大佬全没了，不然几乎不用考虑反代问题，有VPS的同学就更方便了，一个VPS挂了还能备另一个^_^
//8、不用在意那些奇怪的变量名，根据后面注释的备注去改，大概也就前50行看一下备注就行，clash配置在底部，懂的可以根据自身需求修改
//9、纯手搓配置，去除任何API外链，直接改好了部署就行，这样安全性史无前例
//10、通用订阅不支持私钥功能，使用通用订阅需关闭私钥功能再订阅节点，CF不支持自身1.1.1.1的DNS解析，如果无法连通可以检查客户端DNS设置
//11、由于本人仅使用openclash和clash meta，其他平台软件均未测试，请自行测试研究，要是不能用就算了，不负责改进，继续概不负责^_^
//12、由于本人纯菜，很多代码解释都是根据自己的理解瞎编的，专业的无视就好，单纯为了帮助小白理解代码大致原理^_^

import { connect } from 'cloudflare:sockets';

let 哎呀呀这是我的ID啊 = "66666"; // 123456实际上这是你的订阅路径，支持任意大小写字母和数字，[域名/ID]进入订阅页面
let 哎呀呀这是我的VL密钥 = "ae13a35c-cbcc-4da6-bb51-5a70cc0a62a8"; // ae13a35c-cbcc-4da6-bb51-5a70cc0a62a8这是真实的UUID，会进行验证，建议修改为自己的规范化UUID

let 私钥开关 = false //是否启用私钥功能，true启用，false不启用，因为私钥功能只支持clash，如果打算使用通用订阅则需关闭私钥功能
let 咦这是我的私钥哎 = "123456"; // 123456这是你的私钥，提高隐秘性安全性，就算别人扫到你的域名也无法链接，再也不怕别人薅请求数了^_^

let 隐藏订阅 = false //选择是否隐藏订阅页面，false不隐藏，true隐藏，当然隐藏后自己也无法订阅，因为配置固定，适合自己订阅后就隐藏，防止被爬订阅，并且可以到下方添加嘲讽语^_^
let 嘲讽语 = "哎呀你找到了我，但是我就是不给你看，气不气，嘿嘿嘿" //隐藏订阅后，真实的订阅页面就会显示这段话，想写啥写啥

//let 我的优选 = '' //CF的节点，填域名或IP，好的优选一个就够了，由于CFcdn常规13端口开放，可以生成全端口节点
//let 我的优选IPV6 = '' //CF的IPV6节点，填域名或IP，好的优选一个就够了，由于CFcdn常规13端口开放，可以生成全端口节点
let 我的优选 = [ //#后面加备注，备注不能重复，否则会订阅失败。CF的节点，填域名或IP，默认443端口，ipv6需要加[ ]。以下提供几个例子：
  'cf.090227.xyz:2053',
  'cmcc.090227.xyz:2053',
  'ct.090227.xyz:2053',
];

//多优选完全替代特殊优选，所有原版的特色优选已经注释掉

//let 特殊优选 = '' //非CF的节点，填域名或IP，结合你的反代一起使用的话，这个节点可以完全的固定落地地区，例如同时都使用美国的
//let 特殊优选的端口 = '' //非CF的节点端口
//let 非CF节点是否打开tls = 'true' //非CF的节点TLS开关，true，false，通用订阅此功能无效，默认使用tls

let 启用反代功能 = true //选择是否启用反代功能，false，true，现在你可以自由的选择是否启用反代功能了
let 反代IP = [
  'ts.hpc.tw',//ts.hpc.tw
] //反代IP或域名，反代IP端口一般情况下不用填写，如果你非要用非标反代的话，可以填'ts.hpc.tw:443'这样  ts.hpc.tw

let 启用SOCKS5反代 = true //如果启用此功能，原始反代将失效
let 我的SOCKS5账号 = 'TG:CMLiussss@socks5.serv00.090227.xyz:35555' //格式'账号:密码@地址:端口' TG:CMLiussss@socks5.serv00.090227.xyz:35555

//let 我的节点名字 = '逍遥君优选' //自己的节点名字

let 伪装网页 = '' //填入伪装网页，格式'www.youku.com'，如果不填，脚本本身有个内置的简单代理页面，建议用小站伪装或者直接内置，比较靠谱

let 启用全局分段 = true //选择是否使用全局分段功能，试验功能，分段传输可以降低worker压力，提升传输稳定性。
let 分段大小 = 1*1024; //分段大小，建议不要随意修改，这是测试的比较适合的数值。
//////////////////////////////////////////////////////////////////////////网页入口////////////////////////////////////////////////////////////////////////
export default {
  async fetch(访问请求, env) {
      const 读取我的请求标头 = 访问请求.headers.get('Upgrade');
      const url = new URL(访问请求.url);
      if (!读取我的请求标头 || 读取我的请求标头 !== 'websocket') {
          switch (url.pathname) {
              case `/${哎呀呀这是我的ID啊}`: {
                  const 订阅页面 = 给我订阅页面(哎呀呀这是我的ID啊, 访问请求.headers.get('Host'));
                  return new Response(`${订阅页面}`, {
                      status: 200,
                      headers: {
                          "Content-Type": "text/plain;charset=utf-8",
                      }
                  });
              }
              case `/${哎呀呀这是我的ID啊}/${转码}${转码2}`: {
                  if (隐藏订阅) {
                  return new Response (`${嘲讽语}`, {
                  status: 200,
                  headers: {
                      "Content-Type": "text/plain;charset=utf-8",
                      }
                  });
                  } else {
                  const 通用配置文件 = 给我通用配置文件(访问请求.headers.get('Host'));
                  return new Response(`${通用配置文件}`, {
                      status: 200,
                      headers: {
                          "Content-Type": "text/plain;charset=utf-8",
                      }
                  });
                }
              }
              case `/${哎呀呀这是我的ID啊}/${小猫}${咪}`: {
                if (隐藏订阅) {
                    return new Response(`${嘲讽语}`, {
                        status: 200,
                        headers: {
                            "Content-Type": "text/plain;charset=utf-8",
                        }
                    });
                } else {
                    // 使用 async/await 处理异步
                    const 小猫咪配置文件 = await 给我小猫咪配置文件(访问请求.headers.get('Host'));
                    return new Response(`${小猫咪配置文件}`, {
                        status: 200,
                        headers: {
                            "Content-Type": "text/plain;charset=utf-8",
                        }
                    });
                }
            }
              default:
              if (伪装网页) {
                  url.hostname = 伪装网页;
                  url.protocol = 'https:';
                  访问请求 = new Request(url, 访问请求);
                  return fetch(访问请求);
              } else {
                  访问请求 = new Request(url, 访问请求);
                  return 代理页面(访问请求);
              }
          }
      } else if (读取我的请求标头 === 'websocket'){
          FDIP = env.PROXYIP;
          我的SOCKS5账号 = env.SOCKS5 || 我的SOCKS5账号;
          启用SOCKS5反代 = (env.SOCKS5OPEN === 'true') ? true : (env.SOCKS5OPEN === 'false' ? false : 启用SOCKS5反代);
          if (私钥开关) {
          const 验证我的私钥 = 访问请求.headers.get('my-key')
          if (验证我的私钥 === 咦这是我的私钥哎) {
          return await 升级WS请求(访问请求);
          }
          }
          if (!私钥开关) {
          return await 升级WS请求(访问请求);
          }
      }
  }
};
////////////////////////////////////////////////////////////////////////内置代理页面//////////////////////////////////////////////////////////////////////
async function 代理页面(request) {
  const url = new URL(request.url);
  if (url.pathname === '/' || url.pathname === '/proxy/') {
    return createLandingPage();
  }
  let actualUrlStr = url.pathname.replace("/proxy/", "") + url.search + url.hash;
  if (!actualUrlStr.startsWith('http://') && !actualUrlStr.startsWith('https://')) {
    actualUrlStr = 'https://' + actualUrlStr;
  }
  try {
    const actualUrl = new URL(actualUrlStr);
    const modifiedRequest = new Request(actualUrl, {
      headers: request.headers,
      method: request.method,
      body: (request.method === 'POST' || request.method === 'PUT') ? request.body : undefined,
      redirect: 'follow'
    });
    const response = await fetch(modifiedRequest);
    if (!response.ok) {
      throw new Error(`Fetch request failed with status: ${response.status}`);
    }
    const clonedResponseBody = await response.clone().text();
    const modifiedResponse = new Response(clonedResponseBody, response);
    modifiedResponse.headers.set('Access-Control-Allow-Origin', '*');
    modifiedResponse.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    modifiedResponse.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    return modifiedResponse;
  } catch (error) {
    return new Response(`Error: ${error.message}`, { status: 500 });
  }
  
}
function createLandingPage() {
  const html = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
  <style>
  body {
    background-color: #fbfbfb;
    font-family: Arial, sans-serif;
  }
  h1 {
    text-align: center;
    color: #444;
  }
  .container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100vh;
  }
  form {
    background-color: white;
    box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
    padding: 2rem;
    border-radius: 8px;
  }
  input {
    display: block;
    width: 100%;
    font-size: 18px;
    padding: 15px;
    border: solid 1px #ccc;
    border-radius: 4px;
    margin: 1rem 0;
  }
  button {
    padding: 15px;
    background-color: #0288d1;
    color: white;
    font-size: 18px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    width: 100%;
  }
  button:hover {
    background-color: #039BE5;
  }
</style>
    <meta charset="UTF-8">
    <title>代理服务器</title>
  </head>
  <body>
    <h1>输入您想访问的网址，本网页主要方便拉库用，并不能科学</h1>
    <form id="proxy-form">
      <input type="text" id="url" name="url" placeholder="https://示例.com" required />
      <button type="submit">访问</button>
    </form>
    <script>
      const form = document.getElementById('proxy-form');
      form.addEventListener('submit', event => {
        event.preventDefault();
        const input = document.getElementById('url');
        const actualUrl = input.value;
        const proxyUrl = '/proxy/' + actualUrl;
        location.href = proxyUrl;
      });
    </script>
  </body>
  </html>
  `;
  return new Response(html, {
    headers: { 'Content-Type': 'text/html' }
  });
}
////////////////////////////////////////////////////////////////////////脚本主要架构//////////////////////////////////////////////////////////////////////
//第一步，读取和构建基础访问结构
async function 升级WS请求(访问请求) {
  const 创建WS接口 = new WebSocketPair();
  const [客户端, WS接口] = Object.values(创建WS接口);
  WS接口.accept();
  const 读取我的加密访问内容数据头 = 访问请求.headers.get('sec-websocket-protocol') || '';
  const 读取解密后的WS数据流 = await 创建我的WS服务(WS接口, 读取我的加密访问内容数据头);
  let 远程传输 = { value: null, };
  读取解密后的WS数据流.pipeTo(new WritableStream({
      async write(VL数据) {
          if (远程传输.value) {
              const 传输数据 = 远程传输.value.writable.getWriter();
              if (启用全局分段) {
                  await 发往TCP目标的分块传输(传输数据, VL数据);
              } else {
                  await 传输数据.write(VL数据);
              }
              传输数据.releaseLock();
              return;
              }
          const 解析VL数据 = await 解析VL标头(VL数据); //解析VL访问请求和数据，包括目标地址[如谷歌油管等]，目标端口，数据内容等
          if (解析VL数据 === null) {
            await 读取解密后的WS数据流.cancel();
            WS接口.close()
            return new Response('Forbidden', { status: 403 });
          }
          const { 识别地址类型, 访问地址 = '', 访问端口 = '', 创建原始数据索引, } = 解析VL数据;
          const 写入数据请求 = VL数据.slice(创建原始数据索引);
          TCP握手协议(远程传输, 识别地址类型, 访问地址, 访问端口, 写入数据请求, WS接口);
      },
  }));
  return new Response(null, {
      status: 101,
      webSocket: 客户端,
  });
}
async function 发往TCP目标的分块传输(传输数据, VL数据, offset = 0) {
  while (offset < VL数据.byteLength) {
    const 分段数据块 = VL数据.slice(offset, offset + 分段大小);
    await 传输数据.write(分段数据块);
    await new Promise(resolve => setTimeout(resolve, 0));
    offset += 分段大小;
  }
}
//第二步，解密WS访问内容，建立WS服务监听状态
async function 创建我的WS服务(WS接口, 解密我的访问数据) {
  const 数据流 = new ReadableStream({
      async start(控制器) {
          WS接口.addEventListener('message', (event) => { //监听WS接口数据并发送给目标服务器
              const message = event.data
              控制器.enqueue(message)
          });
          WS接口.addEventListener('close', () => { //监听客户端WS接口关闭信息，结束流传输
              控制器.close();
              return;
          });
          WS接口.addEventListener('error', () => { //监听客户端WS接口异常信息，结束流传输
              控制器.close();
              return;
          });
          const {earlyData} = await 使用64位加解密(解密我的访问数据); //解密目标访问数据，传递给TCP握手进程
          if (earlyData) {
              控制器.enqueue(earlyData);
          };
      }
  });
  return 数据流;
}
async function 使用64位加解密(还原混淆字符) {
  还原混淆字符 = 还原混淆字符.replace(/-/g, '+').replace(/_/g, '/');
  const 解密数据 = atob(还原混淆字符);
  const 解密_你_个_丁咚_咙_咚呛 = Uint8Array.from(解密数据, (c) => c.charCodeAt(0));
  return { earlyData: 解密_你_个_丁咚_咙_咚呛.buffer };
}
//第三步，解读VL协议数据，建立客户端VL--workers的完整索引通道
async function 解析VL标头(VL数据) {
    if (验证VL的密钥(new Uint8Array(VL数据.slice(1, 17))) !== 哎呀呀这是我的VL密钥) {
		return null;
	  }
  	const 获取数据定位 = new Uint8Array(VL数据.slice(17, 18))[0];
  	const 提取端口索引 = 18 + 获取数据定位 + 1;
  	const 建立端口缓存 = VL数据.slice(提取端口索引, 提取端口索引 + 2);
  	const 访问端口 = new DataView(建立端口缓存).getUint16(0);
  	const 提取地址索引 = 提取端口索引 + 2;
  	const 建立地址缓存 = new Uint8Array(VL数据.slice(提取地址索引, 提取地址索引 + 1));
  	const 识别地址类型 = 建立地址缓存[0];
  	let 地址长度 = 0;
  	let 地址信息 = '';
  	let 地址信息索引 = 提取地址索引 + 1;
  	switch (识别地址类型) {
  	  	case 1:
  	  	    地址长度 = 4;
  	  	    地址信息 = new Uint8Array(
                VL数据.slice(地址信息索引, 地址信息索引 + 地址长度)
  	  	    ).join('.');
  	  	    break;
  	  	case 2:
  	  	    地址长度 = new Uint8Array(
                VL数据.slice(地址信息索引, 地址信息索引 + 1)
  	  	    )[0];
  	  	    地址信息索引 += 1;
  	  	    地址信息 = new TextDecoder().decode(
                VL数据.slice(地址信息索引, 地址信息索引 + 地址长度)
  	  	    );
  	  	    break;
  	  	case 3:
  	  	    地址长度 = 16;
  	  	    const dataView = new DataView(
                VL数据.slice(地址信息索引, 地址信息索引 + 地址长度)
  	  	    );
  	  	    const ipv6 = [];
  	  	    for (let i = 0; i < 8; i++) {
  	  	        ipv6.push(dataView.getUint16(i * 2).toString(16));
  	  	    }
  	  	    地址信息 = ipv6.join(':');
  	  	    break;
        default:
            return null;
  	}
  	return {
        识别地址类型,
  	  	访问地址: 地址信息,
  	  	访问端口,
  	  	创建原始数据索引: 地址信息索引 + 地址长度,
  	};
}
function 验证VL的密钥(arr, offset = 0) {
	const uuid = 提取VL的密钥(arr, offset);
	return uuid;
}
function 提取VL的密钥(arr, offset = 0) {
	return (转换密钥格式[arr[offset + 0]] + 转换密钥格式[arr[offset + 1]] + 转换密钥格式[arr[offset + 2]] + 转换密钥格式[arr[offset + 3]] + "-" +
		转换密钥格式[arr[offset + 4]] + 转换密钥格式[arr[offset + 5]] + "-" +
		转换密钥格式[arr[offset + 6]] + 转换密钥格式[arr[offset + 7]] + "-" +
		转换密钥格式[arr[offset + 8]] + 转换密钥格式[arr[offset + 9]] + "-" +
		转换密钥格式[arr[offset + 10]] + 转换密钥格式[arr[offset + 11]] + 转换密钥格式[arr[offset + 12]] +
		转换密钥格式[arr[offset + 13]] + 转换密钥格式[arr[offset + 14]] + 转换密钥格式[arr[offset + 15]]).toLowerCase();
}
const 转换密钥格式 = [];
for (let i = 0; i < 256; ++i) {
	转换密钥格式.push((i + 256).toString(16).slice(1));
}
//第四步，建立VL--workers--外网的TCP握手协议
async function TCP握手协议(远程传输, 识别地址类型, 访问地址, 访问端口, 写入数据请求, WS接口) {
  反代数组 = await 获取反代IP列表();
  const 目标TCP接口 = await 创建TCP握手(访问地址, 访问端口);
  TCP接口访问WS(目标TCP接口, WS接口, SOCKS5反代兜底, 原始反代兜底);
  async function SOCKS5反代兜底(){
    const 反代SOCKS5接口 = await 创建SOCKS5握手(访问地址, 访问端口);
    if (反代SOCKS5接口 === null) {
      WS接口.close(1006);
      return;
    }
    TCP接口访问WS(反代SOCKS5接口, WS接口, SOCKS5反代兜底, 原始反代兜底);
    return;
  }
  async function 原始反代兜底() {
    let [反代IP地址, 反代IP端口] = 反代IP库.split(':');
    const 反代TCP接口 = await 创建TCP握手(反代IP地址, 反代IP端口 || 访问端口);
    TCP接口访问WS(反代TCP接口, WS接口, SOCKS5反代兜底, 原始反代兜底);
    return;
  }
  async function 创建TCP握手(地址, 端口) {
    const TCP接口 = connect({ hostname: 地址, port: 端口 });
    远程传输.value = TCP接口;
    const 传输数据 = TCP接口.writable.getWriter();
    await 传输数据.write(写入数据请求);
    传输数据.releaseLock();
    return TCP接口;
  }
  async function 创建SOCKS5握手(地址, 端口) {
    const SOCKS5接口 = await 创建SOCKS5接口(识别地址类型, 地址, 端口)
    if (SOCKS5接口 === null){
      return null;
    }
    远程传输.value = SOCKS5接口;
    const 传输数据 = SOCKS5接口.writable.getWriter();
    await 传输数据.write(写入数据请求);
    传输数据.releaseLock();
    return SOCKS5接口;
  }
  return;
}
//第五步，进行VL--workers--外网的WS数据传输，TCP握手成功后建立最终的WS数据传输通道
async function TCP接口访问WS(TCP接口, WS接口, SOCKS5反代兜底, 原始反代兜底) {
  let VL标头 = new Uint8Array([0, 0]);
  let 传入数据 = false;
  await TCP接口.readable.pipeTo(new WritableStream({ 
    async write(VL数据) {
        传入数据 = true;
        if (VL标头 && WS接口.readyState === 1) {
            await WS接口.send(await new Blob([VL标头, VL数据]).arrayBuffer());
            VL标头 = null;
        } else {
            if (启用全局分段) {
                await WS回传的分块传输(WS接口, VL数据);
            } else {
                await WS接口.send(VL数据);
            }
        }
    },
  }));
  if (启用反代功能 && 传入数据 === false) {
    TCP接口.close();
      if (启用SOCKS5反代) {
        启用SOCKS5反代 = false;
        SOCKS5反代兜底();
        return;
      }
      if (反代数组.length > 0 && 反代IP库计数器 < 反代数组.length) {
        反代IP库 = 反代数组[反代IP库计数器];
        反代IP库计数器++;
        原始反代兜底();
        return;
      }
  }
  TCP接口.close();
  检查并关闭WS接口(WS接口)
  return;
}
async function WS回传的分块传输(WS接口, VL数据, offset = 0) {
  while (offset < VL数据.byteLength) {
    const 分段数据块 = VL数据.slice(offset, offset + 分段大小);
    await WS接口.send(分段数据块);
    await new Promise(resolve => setTimeout(resolve, 0));
    offset += 分段大小;
  }
}
async function 检查并关闭WS接口(WS接口, 最大等待时间 = 1000, 检查间隔 = 50) {
  if (WS接口.bufferedAmount === 0) {
    WS接口.close(1000);
  } else {
    let 初始时间 = 0;
    while (初始时间 < 最大等待时间) {
      await new Promise(resolve => setTimeout(resolve, 检查间隔));
      if (WS接口.bufferedAmount === 0) {
        WS接口.close(1000);
        return;
      }
      初始时间 += 检查间隔;
    }
    WS接口.close(1000);
  }
  return;
}
let FDIP, 反代IP库, 反代IP库计数器 = 0;
let 反代数组 = [];
async function 获取反代IP列表() {
  if (FDIP) {
  反代数组 = FDIP.split('\n').map(line => line.trim()).filter(line => line); 
  }
  const 添加反代IP = Array.isArray(反代IP) ? 反代IP : [反代IP];
  反代数组.unshift(...添加反代IP);
  return 反代数组;
}
//////////////////////////////////////////////////////////////////////////SOCKS5部分//////////////////////////////////////////////////////////////////////
async function 创建SOCKS5接口(识别地址类型, 访问地址, 访问端口) {
	const { username, password, hostname, port } = await 获取SOCKS5账号(我的SOCKS5账号);
  const SOCKS5接口 = connect({ hostname, port });
	const writer = SOCKS5接口.writable.getWriter();
	const reader = SOCKS5接口.readable.getReader();
  if (!writer || !reader) {
    return 关闭接口并退出();
  }
  const socksGreeting = new Uint8Array([5, 2, 0, 2]);
  await writer.write(socksGreeting);
	const encoder = new TextEncoder();
	let res = (await reader.read()).value;
	if (res[0] !== 0x05) {
    return 关闭接口并退出();
	}
	if (res[1] === 0xff) {
    return 关闭接口并退出();
	}
	if (res[1] === 0x02) {
		if (!username || !password) {
      return 关闭接口并退出();
		}
		const authRequest = new Uint8Array([
			1,                   // 认证子协议版本
			username.length,    // 用户名长度
			...encoder.encode(username), // 用户名
			password.length,    // 密码长度
			...encoder.encode(password)  // 密码
		]);
		await writer.write(authRequest);
		res = (await reader.read()).value;
		if (res[0] !== 0x01 || res[1] !== 0x00) {
      return 关闭接口并退出();
		}
	}
	let DSTADDR;	// DSTADDR = ATYP + DST.ADDR
	switch (识别地址类型) {
		case 1: // IPv4
			DSTADDR = new Uint8Array(
				[1, ...访问地址.split('.').map(Number)]
			);
			break;
		case 2: // 域名
			DSTADDR = new Uint8Array(
				[3, 访问地址.length, ...encoder.encode(访问地址)]
			);
			break;
		case 3: // IPv6
			DSTADDR = new Uint8Array(
				[4, ...访问地址.split(':').flatMap(x => [parseInt(x.slice(0, 2), 16), parseInt(x.slice(2), 16)])]
			);
			break;
		default:
      return 关闭接口并退出();
	}
	const socksRequest = new Uint8Array([5, 1, 0, ...DSTADDR, 访问端口 >> 8, 访问端口 & 0xff]);
	await writer.write(socksRequest);
	res = (await reader.read()).value;
	writer.releaseLock();
	reader.releaseLock();
	return SOCKS5接口;
  function 关闭接口并退出(){ //关闭SOCKS5接口，防止卡死
    if (writer) {
      writer.releaseLock();
    }
    if (reader) {
      reader.releaseLock();
    }
    if (SOCKS5接口) {
      SOCKS5接口.close();
    }
    return null;
  }
}
async function 获取SOCKS5账号(SOCKS5) {
  const [latter, former] = SOCKS5.split("@").reverse();
  let username, password, hostname, port;
  if (former) {
    const formers = former.split(":");
    username = formers[0];
    password = formers[1];
  }
  const latters = latter.split(":");
  port = Number(latters.pop());
  hostname = latters.join(":");
  return { username, password, hostname, port };
}
//////////////////////////////////////////////////////////////////////////订阅页面////////////////////////////////////////////////////////////////////////
let 转码 = 'vl', 转码2 = 'ess', 符号 = '://', 小猫 = 'cla', 咪 = 'sh', 我的私钥;
if (私钥开关) {
  我的私钥 = `my-key: ${咦这是我的私钥哎}`
} else {
  我的私钥 = ""
}
function 给我订阅页面(哎呀呀这是我的ID啊, hostName) {
return `
1、本worker的私钥功能只支持${小猫}${咪}，仅open${小猫}${咪}和${小猫}${咪} meta测试过，其他${小猫}${咪}类软件自行测试
2、若使用通用订阅请关闭私钥功能
3、其他需求自行研究
通用的：https${符号}${hostName}/${哎呀呀这是我的ID啊}/${转码}${转码2}
猫咪的：https${符号}${hostName}/${哎呀呀这是我的ID啊}/${小猫}${咪}
`;
}

function 给我通用配置文件(hostName) {
  const 默认端口 = '443';
  const 已用备注集合 = new Map(); // 用于记录IP及其计数
  const 特殊长链接Links = 我的优选.map(选择ip => {
    let 查找ip, 查找port;
    let 节点备注 = ''; // 用于存储节点备注
    if (选择ip.includes('#')) {
      [选择ip, 节点备注] = 选择ip.split('#'); // 分离节点备注
    }
    if (选择ip.startsWith('[')) {
      // 处理IPv6
      [查找ip, 查找port] = 选择ip.endsWith(']') ? [选择ip.slice(1, -1), ''] : 选择ip.slice(1).split(']:');
      if (!查找port) 查找port = 默认端口;
    } else {
      // 处理IPv4
      [查找ip, 查找port] = 选择ip.split(':');
    }
    const 最终IP = 查找ip.includes(':') ? `[${查找ip}]` : 查找ip;
    const 最终端口 = 查找port ? 查找port : 默认端口;
    // 处理节点备注重复的情况
    const 节点名字 = 已用备注集合.has(`${节点备注 ? `${节点备注}` : `${最终IP}`}`) ? `${节点备注 ? `${节点备注}` : `${最终IP}`}(${已用备注集合.get(`${节点备注 ? `${节点备注}` : `${最终IP}`}`)})` : `${节点备注 ? `${节点备注}` : `${最终IP}`}`;
    已用备注集合.set(`${节点备注 ? `${节点备注}` : `${最终IP}`}`, (已用备注集合.get(`${节点备注 ? `${节点备注}` : `${最终IP}`}`) || 0) + 1);
    return (`${转码}${转码2}${符号}${哎呀呀这是我的VL密钥}@${最终IP}:${最终端口}?security=tls&sni=${hostName}&type=ws&path=%2F%3Fed%3D2560&host=${hostName}&encryption=none#${节点名字}`);
  });
  if (私钥开关) {
    return `请先关闭私钥功能`;
  } else {
    return btoa(unescape(encodeURIComponent(特殊长链接Links.join('\n'))));
    //return (特殊长链接Links.join('\n'));
  }
}

async function 给我小猫咪配置文件(hostName) {
  const 默认端口 = '443';
  const 已用备注集合1 = new Map(); // 用于记录IP及其计数
  const 已用备注集合2 = new Map(); // 用于记录IP及其计数
  const 已用备注集合3 = new Map(); // 用于记录IP及其计数
  const 特殊长链接Links = 我的优选.map(选择ip => {
    let 查找ip, 查找port;
    let 节点备注 = ''; // 用于存储节点备注
    if (选择ip.includes('#')) {
      [选择ip, 节点备注] = 选择ip.split('#'); // 分离节点备注
    }
    if (选择ip.startsWith('[')) {
      // 处理IPv6
      [查找ip, 查找port] = 选择ip.endsWith(']') ? [选择ip.slice(1, -1), ''] : 选择ip.slice(1).split(']:');
      if (!查找port) 查找port = 默认端口;
    } else {
      // 处理IPv4
      [查找ip, 查找port] = 选择ip.split(':');
    }
    const 最终IP = 查找ip.includes(':') ? `${查找ip}` : 查找ip;
    const 最终端口 = 查找port ? 查找port : 默认端口;
    // 处理节点备注重复的情况
    const 节点名字 = 已用备注集合1.has(`${节点备注 ? `${节点备注}` : `${最终IP}`}`) ? `${节点备注 ? `${节点备注}` : `${最终IP}`}(${已用备注集合1.get(`${节点备注 ? `${节点备注}` : `${最终IP}`}`)})` : `${节点备注 ? `${节点备注}` : `${最终IP}`}`;
    已用备注集合1.set(`${节点备注 ? `${节点备注}` : `${最终IP}`}`, (已用备注集合1.get(`${节点备注 ? `${节点备注}` : `${最终IP}`}`) || 0) + 1);
    return (`  - {name: ${节点名字},server: ${最终IP},port: ${最终端口},type: ${转码}${转码2},uuid: ${哎呀呀这是我的VL密钥},tls: true,alpn: [h3],skip-cert-verify: true,servername: ${hostName},client-fingerprint: random,network: ws,ws-opts: {path: "/?ed=2560",headers: {Host: ${hostName}}},udp: true}
${我的私钥}`);
  });
  if (私钥开关) {
      return `请先关闭私钥功能`;
  } else {
      let dns配置 = `port: 7890
allow-lan: true
mode: rule
log-level: info
unified-delay: true
global-client-fingerprint: chrome
dns:
  enable: true
  listen: :53
  ipv6: true
  enhanced-mode: fake-ip
  fake-ip-range: 198.18.0.1/16
  default-nameserver: 
    - 223.5.5.5
    - 119.29.29.29
  nameserver:
    - https://dns.alidns.com/dns-query
    - https://doh.pub/dns-query
  fallback:
    - tls://1.0.0.1:853
    - tls://dns.google:853
  fallback-filter:
    geoip: true
    geoip-code: CN
    geosite:
      - gfw
    ipcidr:
      - 240.0.0.0/4
`;
let proxy组 = `proxy-groups:
- name: 节点选择
  type: select
  proxies:
  - 自动选择
  - DIRECT
`;
我的优选.forEach(选择ip => {
  let 查找ip, 查找port;
  let 节点备注 = ''; // 用于存储节点备注
  if (选择ip.includes('#')) {
    [选择ip, 节点备注] = 选择ip.split('#'); // 分离节点备注
  }
  if (选择ip.startsWith('[')) {
    // 处理IPv6
    [查找ip, 查找port] = 选择ip.endsWith(']') ? [选择ip.slice(1, -1), ''] : 选择ip.slice(1).split(']:');
    if (!查找port) 查找port = 默认端口;
  } else {
    // 处理IPv4
    [查找ip, 查找port] = 选择ip.split(':');
  }
  const 最终IP = 查找ip.includes(':') ? `${查找ip}` : 查找ip;
  const 节点名字 = 已用备注集合2.has(`${节点备注 ? `${节点备注}` : `${最终IP}`}`) ? `${节点备注 ? `${节点备注}` : `${最终IP}`}(${已用备注集合2.get(`${节点备注 ? `${节点备注}` : `${最终IP}`}`)})` : `${节点备注 ? `${节点备注}` : `${最终IP}`}`;
  已用备注集合2.set(`${节点备注 ? `${节点备注}` : `${最终IP}`}`, (已用备注集合2.get(`${节点备注 ? `${节点备注}` : `${最终IP}`}`) || 0) + 1);
  proxy组 += `  - ${节点名字}\n`;
});
proxy组 += `- name: 自动选择
  type: url-test
  url: http://www.gstatic.com/generate_204
  interval: 300
  tolerance: 50
  proxies:
`;
我的优选.forEach(选择ip => {
  let 查找ip, 查找port;
  let 节点备注 = ''; // 用于存储节点备注
  if (选择ip.includes('#')) {
    [选择ip, 节点备注] = 选择ip.split('#'); // 分离节点备注
  }
  if (选择ip.startsWith('[')) {
    // 处理IPv6
    [查找ip, 查找port] = 选择ip.endsWith(']') ? [选择ip.slice(1, -1), ''] : 选择ip.slice(1).split(']:');
    if (!查找port) 查找port = 默认端口;
  } else {
    // 处理IPv4
    [查找ip, 查找port] = 选择ip.split(':');
  }
  const 最终IP = 查找ip.includes(':') ? `${查找ip}` : 查找ip;
  const 节点名字 = 已用备注集合3.has(`${节点备注 ? `${节点备注}` : `${最终IP}`}`) ? `${节点备注 ? `${节点备注}` : `${最终IP}`}(${已用备注集合3.get(`${节点备注 ? `${节点备注}` : `${最终IP}`}`)})` : `${节点备注 ? `${节点备注}` : `${最终IP}`}`;
  已用备注集合3.set(`${节点备注 ? `${节点备注}` : `${最终IP}`}`, (已用备注集合3.get(`${节点备注 ? `${节点备注}` : `${最终IP}`}`) || 0) + 1);
  proxy组 += `  - ${节点名字}\n`;
});
proxy组 += `rules:
`
const urls = [ // 使用你要处理的URL数组，添加更多的URL
  'ruleset=节点选择,https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/Ruleset/GoogleCNProxyIP.list',
  'ruleset=DIRECT,https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/LocalAreaNetwork.list',
  'ruleset=DIRECT,https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/UnBan.list',
  'ruleset=DIRECT,https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/GoogleCN.list',
  'ruleset=DIRECT,https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/Ruleset/SteamCN.list',
  'ruleset=DIRECT,https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/ChinaDomain.list',
  'ruleset=DIRECT,https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/ChinaCompanyIp.list',
  'ruleset=DIRECT,https://raw.githubusercontent.com/ACL4SSR/ACL4SSR/master/Clash/ChinaIp.list',
];
async function processUrls(urls) {
  let allProcessedLines = [];
  for (const url of urls) {
      const [ruleset, fetchUrl] = url.split(',');
      const strippedRuleset = ruleset.replace('ruleset=', ''); 
      try {
          const response = await fetch(fetchUrl);
          const text = await response.text();
          const lines = text.split('\n');
          const processedLines = lines
              .filter(line => line.trim() !== '' && !line.startsWith('#')) // 过滤空行和以#开头的行
              .map(line => {
                  if (line.includes('no-resolve')) {
                      return `  - ${line.replace('no-resolve', `${strippedRuleset},no-resolve`)}`;
                  } else {
                      return `  - ${line},${strippedRuleset}`;
                  }
              });
          allProcessedLines.push(...processedLines);
      } catch (error) {
          console.error(`Error fetching ${fetchUrl}:`, error);
      }
  }
  return allProcessedLines;
}
const processedUrls = await processUrls(urls);
return dns配置 + "proxies:\n" + 特殊长链接Links.join('') + proxy组 +`  - DOMAIN-SUFFIX,xn--ngstr-lra8j.com,节点选择
  - DOMAIN-SUFFIX,services.googleapis.cn,节点选择
`+ processedUrls.join('\n')+`
  - GEOIP,CN,DIRECT,no-resolve
  - MATCH,节点选择
`;
  }
}
