import { connect } from 'cloudflare:sockets';

const 哎呀呀这是我的ID啊 = [""]; //这是你的ID，去除UUID规格限制，支持大小写字母和数字任意组合，安全性提高更不容易扫出，就是订阅链接的ID，[域名/ID]进入订阅页面
const 哎呀呀这是我的UUID = ["71fcd6eb-3f55-4263-71b2-fda10a6c7ca1"]; //给订阅一个虚假UUID，因为很多客户端需要标准格式化的UUID，本worker并不验证UUID，这个UUID并不重要，只要是规格化的就行

const 私钥开关 = false //是否启用私钥功能，true启用，false不启用，因为私钥功能只支持clash，如果打算使用通用订阅则需关闭私钥功能
const 咦这是我的私钥哎 = [""]; //这是你的私钥，提高隐秘性安全性，就算别人扫到你的域名也无法链接，再也不怕别人薅请求数了^_^

const 隐藏订阅 = false //选择是否隐藏订阅页面，false不隐藏，true隐藏，当然隐藏后自己也无法订阅，因为配置固定，适合自己订阅后就隐藏，防止被爬订阅，并且可以到下方添加嘲讽语^_^
const 嘲讽语 = "哎呀你找到了我，但是我就是不给你看，气不气，嘿嘿嘿" //隐藏订阅后，真实的订阅页面就会显示这段话，想写啥写啥

const 我的优选 = 'cmcc.090227.xyz' //CF的节点，填域名或IP，好的优选一个就够了，由于CFcdn常规13端口开放，可以生成全端口节点
const 我的优选IPV6 = '' //CF的IPV6节点，这个只增加了clash订阅，填域名或IP，好的优选一个就够了，由于CFcdn常规13端口开放，可以生成全端口节点

const 启用反代功能 = true //选择是否启用反代功能，false，true，现在你可以自由的选择是否启用反代功能了
const 反代IP = 'proxyip.fxxk.dedyn.io' //反代IP或域名，不需要填端口，反代IP只是兜底策略，不能固定落地地区，可以结合非CF节点一起用并选择该节点，固定落地地区

const 特殊优选 = '' //非CF的节点，填域名或IP，结合你的反代一起使用的话，这个节点可以完全的固定落地地区，例如同时都使用美国的
const 特殊优选的端口 = '443' //非CF的节点端口
const 非CF节点是否打开tls = 'true' //非CF的节点TLS开关，true，false，通用订阅此功能无效，默认使用tls

const 我的节点名字 = '天书' //自己的节点名字

const 伪装网页 = '' //填入伪装网页，格式'www.youku.com'，如果不填，脚本本身有个内置的简单代理页面

const 启用全局分段 = true //选择是否使用全局分段功能，试验功能，分段传输可以降低worker压力，提升传输稳定性
const 分段大小 = 1*1024; //分段大小，建议不要随意修改，这是测试的比较适合的数值

export default {
    async fetch(访问请求) {
        const 读取我的请求标头 = 访问请求.headers.get('Upgrade');
        if (!读取我的请求标头 || 读取我的请求标头 !== 'websocket') {
            const url = new URL(访问请求.url);
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
                    return new Response (`${嘲讽语}`, {
                    status: 200,
                    headers: {
                        "Content-Type": "text/plain;charset=utf-8",
                        }
                    });
                    } else {
                    const 小猫咪配置文件 = 给我小猫咪配置文件(访问请求.headers.get('Host'));
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
                    return await fetch(访问请求);
                } else {
                    访问请求 = new Request(url, 访问请求);
                    return await 代理页面(访问请求);
                }
            }
        } else if (读取我的请求标头 === 'websocket'){
            if (私钥开关) {
            const 验证我的私钥 = 访问请求.headers.get('my-key')
            if (验证我的私钥 == 咦这是我的私钥哎) {
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
  const 读取解密后的WS数据流 = 创建我的WS服务(WS接口, 读取我的加密访问内容数据头);
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
          const { 访问地址 = '', 访问端口 = '', 创建原始数据索引, } = await 解析VL标头(VL数据); //解析VL访问请求和数据，包括目标地址[如谷歌油管等]，目标端口，数据内容等
          const 写入数据请求 = VL数据.slice(创建原始数据索引);
          TCP握手协议(远程传输, 访问地址, 访问端口, 写入数据请求, WS接口);
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
function 创建我的WS服务(WS接口, 解密我的访问数据) {
  const 数据流 = new ReadableStream({
      start(控制器) {
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
          const {earlyData} = 使用64位加解密(解密我的访问数据); //解密目标访问数据，传递给TCP握手进程
          if (earlyData) {
              控制器.enqueue(earlyData);
          };
      }
  });
  return 数据流;
}
function 使用64位加解密(还原混淆字符) {
  还原混淆字符 = 还原混淆字符.replace(/-/g, '+').replace(/_/g, '/');
  const 解密数据 = atob(还原混淆字符);
  const 解密_你_个_丁咚_咙_咚呛 = Uint8Array.from(解密数据, (c) => c.charCodeAt(0));
  return { earlyData: 解密_你_个_丁咚_咙_咚呛.buffer };
}
//第三步，解读VL协议数据，建立客户端VL--workers的完整索引通道
async function 解析VL标头(VL数据) {
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
  	}
  	return {
  	  	访问地址: 地址信息,
  	  	访问端口,
  	  	创建原始数据索引: 地址信息索引 + 地址长度,
  	};
}
//第四步，建立VL--workers--外网的TCP握手协议
async function TCP握手协议(远程传输, 访问地址, 访问端口, 写入数据请求, WS接口) {
  	async function 连接写入请求(地址, 端口) {
  	    const TCP接口 = connect({ hostname: 地址, port: 端口, });
  	    远程传输.value = TCP接口;
  	    const 传输数据 = TCP接口.writable.getWriter();
        await 传输数据.write(写入数据请求);
        传输数据.releaseLock();
  	    return TCP接口;
  	}
  	async function 反代兜底() {
  	    const TCP接口 = await 连接写入请求(反代IP, 访问端口) //反代兜底功能，实现逻辑是客户端访问地址--反代IP--实际外网访问地址，并以同样的通道返回数据
  	    TCP接口访问WS(TCP接口, WS接口);
  	}
  	const TCP接口 = await 连接写入请求(访问地址, 访问端口);
  	TCP接口访问WS(TCP接口, WS接口, 反代兜底);
}
//第五步，进行VL--workers--外网的WS数据传输，TCP握手成功后建立最终的WS数据传输通道
async function TCP接口访问WS(TCP接口, WS接口, 重试使用反代兜底访问) {
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
    重试使用反代兜底访问(); //当使用默认节点无法接收到返回数据时，启用反代兜底逻辑重试访问
    return;
  };
  TCP接口.close();
  WS接口.close();
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
const 特殊长链接Links = btoa(`
${转码}${转码2}${符号}${哎呀呀这是我的UUID}@${我的优选}:443?encryption=none&security=tls&type=ws&host=${hostName}&path=%2F%3Fed%3D2560
${转码}${转码2}${符号}${哎呀呀这是我的UUID}@${我的优选}:8443?encryption=none&security=tls&type=ws&host=${hostName}&path=%2F%3Fed%3D2560
${转码}${转码2}${符号}${哎呀呀这是我的UUID}@${我的优选}:2053?encryption=none&security=tls&type=ws&host=${hostName}&path=%2F%3Fed%3D2560
${转码}${转码2}${符号}${哎呀呀这是我的UUID}@${我的优选}:2083?encryption=none&security=tls&type=ws&host=${hostName}&path=%2F%3Fed%3D2560
${转码}${转码2}${符号}${哎呀呀这是我的UUID}@${我的优选}:2087?encryption=none&security=tls&type=ws&host=${hostName}&path=%2F%3Fed%3D2560
${转码}${转码2}${符号}${哎呀呀这是我的UUID}@${我的优选}:2096?encryption=none&security=tls&type=ws&host=${hostName}&path=%2F%3Fed%3D2560
${转码}${转码2}${符号}${哎呀呀这是我的UUID}@${特殊优选}:${特殊优选的端口}?encryption=none&security=tls&type=ws&host=${hostName}&path=%2F%3Fed%3D2560
${转码}${转码2}${符号}${哎呀呀这是我的UUID}@${hostName}:443?encryption=none&security=tls&type=ws&host=${hostName}&path=%2F%3Fed%3D2560
`);
if (私钥开关) {
  return `请先关闭私钥功能`
}else {
  return `${特殊长链接Links}`
}
}
function 给我小猫咪配置文件(hostName) {
return `
dns:
  nameserver:
    - 119.29.29.29
    - 223.5.5.5
  fallback:
    - 8.8.8.8
    - tls://dns.google
    - 2001:4860:4860::8888
proxies:
- name: ${我的节点名字}-tls-443
  type: ${转码}${转码2}
  server: ${我的优选}
  port: 443
  uuid: ${哎呀呀这是我的UUID}
  udp: false
  tls: true
  network: ws
  ws-opts:
    path: "/?ed=2560"
    headers:
      Host: ${hostName}
      ${我的私钥}
- name: ${我的节点名字}-tls-8443
  type: ${转码}${转码2}
  server: ${我的优选}
  port: 8443
  uuid: ${哎呀呀这是我的UUID}
  udp: false
  tls: true
  network: ws
  ws-opts:
    path: "/?ed=2560"
    headers:
      Host: ${hostName}
      ${我的私钥}
- name: ${我的节点名字}-tls-2053
  type: ${转码}${转码2}
  server: ${我的优选}
  port: 2053
  uuid: ${哎呀呀这是我的UUID}
  udp: false
  tls: true
  network: ws
  ws-opts:
    path: "/?ed=2560"
    headers:
      Host: ${hostName}
      ${我的私钥}
- name: ${我的节点名字}-tls-2083
  type: ${转码}${转码2}
  server: ${我的优选}
  port: 2083
  uuid: ${哎呀呀这是我的UUID}
  udp: false
  tls: true
  network: ws
  ws-opts:
    path: "/?ed=2560"
    headers:
      Host: ${hostName}
      ${我的私钥}
- name: ${我的节点名字}-tls-2087
  type: ${转码}${转码2}
  server: ${我的优选}
  port: 2087
  uuid: ${哎呀呀这是我的UUID}
  udp: false
  tls: true
  network: ws
  ws-opts:
    path: "/?ed=2560"
    headers:
      Host: ${hostName}
      ${我的私钥}
- name: ${我的节点名字}-tls-2096
  type: ${转码}${转码2}
  server: ${我的优选}
  port: 2096
  uuid: ${哎呀呀这是我的UUID}
  udp: false
  tls: true
  network: ws
  ws-opts:
    path: "/?ed=2560"
    headers:
      Host: ${hostName}
      ${我的私钥}
- name: ${我的节点名字}-IPV6-tls-443
  type: ${转码}${转码2}
  server: ${我的优选IPV6}
  port: 443
  ip-version: ipv6 # ip-version设置，可以自定义强制走ipv4或ipv6，ipv6-prefer则是双栈优先走ipv6
  uuid: ${哎呀呀这是我的UUID}
  udp: false
  tls: true
  network: ws
  ws-opts:
    path: "/?ed=2560"
    headers:
      Host: ${hostName}
      ${我的私钥}
- name: ${我的节点名字}-IPV6-tls-8443
  type: ${转码}${转码2}
  server: ${我的优选IPV6}
  port: 8443
  ip-version: ipv6 # ip-version设置，可以自定义强制走ipv4或ipv6，ipv6-prefer则是双栈优先走ipv6
  uuid: ${哎呀呀这是我的UUID}
  udp: false
  tls: true
  network: ws
  ws-opts:
    path: "/?ed=2560"
    headers:
      Host: ${hostName}
      ${我的私钥}
- name: ${我的节点名字}-IPV6-tls-2053
  type: ${转码}${转码2}
  server: ${我的优选IPV6}
  port: 2053
  ip-version: ipv6 # ip-version设置，可以自定义强制走ipv4或ipv6，ipv6-prefer则是双栈优先走ipv6
  uuid: ${哎呀呀这是我的UUID}
  udp: false
  tls: true
  network: ws
  ws-opts:
    path: "/?ed=2560"
    headers:
      Host: ${hostName}
      ${我的私钥}
- name: ${我的节点名字}-IPV6-tls-2083
  type: ${转码}${转码2}
  server: ${我的优选IPV6}
  port: 2083
  ip-version: ipv6 # ip-version设置，可以自定义强制走ipv4或ipv6，ipv6-prefer则是双栈优先走ipv6
  uuid: ${哎呀呀这是我的UUID}
  udp: false
  tls: true
  network: ws
  ws-opts:
    path: "/?ed=2560"
    headers:
      Host: ${hostName}
      ${我的私钥}
- name: ${我的节点名字}-IPV6-tls-2087
  type: ${转码}${转码2}
  server: ${我的优选IPV6}
  port: 2087
  ip-version: ipv6 # ip-version设置，可以自定义强制走ipv4或ipv6，ipv6-prefer则是双栈优先走ipv6
  uuid: ${哎呀呀这是我的UUID}
  udp: false
  tls: true
  network: ws
  ws-opts:
    path: "/?ed=2560"
    headers:
      Host: ${hostName}
      ${我的私钥}
- name: ${我的节点名字}-IPV6-tls-2096
  type: ${转码}${转码2}
  server: ${我的优选IPV6}
  port: 2096
  ip-version: ipv6 # ip-version设置，可以自定义强制走ipv4或ipv6，ipv6-prefer则是双栈优先走ipv6
  uuid: ${哎呀呀这是我的UUID}
  udp: false
  tls: true
  network: ws
  ws-opts:
    path: "/?ed=2560"
    headers:
      Host: ${hostName}
      ${我的私钥}
- name: ${我的节点名字}-非CF节点
  type: ${转码}${转码2}
  server: ${特殊优选}
  port: ${特殊优选的端口}
  uuid: ${哎呀呀这是我的UUID}
  udp: false
  tls: ${非CF节点是否打开tls}
  network: ws
  ws-opts:
    path: "/?ed=2560"
    headers:
      Host: ${hostName}
      ${我的私钥}
- name: ${我的节点名字}-备用IPV4节点
  type: ${转码}${转码2}
  server: ${hostName}
  port: 443
  uuid: ${哎呀呀这是我的UUID}
  udp: false
  tls: true
  network: ws
  ws-opts:
    path: "/?ed=2560"
    headers:
      Host: ${hostName}
      ${我的私钥}
- name: ${我的节点名字}-备用IPV6节点
  type: ${转码}${转码2}
  server: ${hostName}
  port: 443
  ip-version: ipv6-prefer  # ip-version设置，可以自定义强制走ipv4或ipv6，ipv6-prefer则是双栈优先走ipv6
  uuid: ${哎呀呀这是我的UUID}
  udp: false
  tls: true
  network: ws
  ws-opts:
    path: "/?ed=2560"
    headers:
      Host: ${hostName}
      ${我的私钥}
proxy-groups:
- name: 🚀 节点选择
  type: select
  proxies:
    - tls负载均衡
    - IPV6-tls负载均衡
    - 自动选择
    - ${我的节点名字}-tls-443
    - ${我的节点名字}-tls-8443
    - ${我的节点名字}-tls-2053
    - ${我的节点名字}-tls-2083
    - ${我的节点名字}-tls-2087
    - ${我的节点名字}-tls-2096
    - ${我的节点名字}-IPV6-tls-443
    - ${我的节点名字}-IPV6-tls-8443
    - ${我的节点名字}-IPV6-tls-2053
    - ${我的节点名字}-IPV6-tls-2083
    - ${我的节点名字}-IPV6-tls-2087
    - ${我的节点名字}-IPV6-tls-2096
    - ${我的节点名字}-非CF节点
    - ${我的节点名字}-备用IPV4节点
    - ${我的节点名字}-备用IPV6节点
- name: 自动选择
  type: url-test
  url: http://www.gstatic.com/generate_204
  interval: 300
  tolerance: 50
  proxies:
    - ${我的节点名字}-tls-443
    - ${我的节点名字}-tls-8443
    - ${我的节点名字}-tls-2053
    - ${我的节点名字}-tls-2083
    - ${我的节点名字}-tls-2087
    - ${我的节点名字}-tls-2096
    - ${我的节点名字}-IPV6-tls-443
    - ${我的节点名字}-IPV6-tls-8443
    - ${我的节点名字}-IPV6-tls-2053
    - ${我的节点名字}-IPV6-tls-2083
    - ${我的节点名字}-IPV6-tls-2087
    - ${我的节点名字}-IPV6-tls-2096
    - ${我的节点名字}-非CF节点
    - ${我的节点名字}-备用IPV4节点
    - ${我的节点名字}-备用IPV6节点
- name: tls负载均衡
  type: load-balance
  url: http://www.gstatic.com/generate_204
  interval: 300
  proxies:
    - ${我的节点名字}-tls-443
    - ${我的节点名字}-tls-8443
    - ${我的节点名字}-tls-2053
    - ${我的节点名字}-tls-2083
    - ${我的节点名字}-tls-2087
    - ${我的节点名字}-tls-2096
- name: IPV6-tls负载均衡
  type: load-balance
  url: http://www.gstatic.com/generate_204
  interval: 300
  proxies:
    - ${我的节点名字}-IPV6-tls-443
    - ${我的节点名字}-IPV6-tls-8443
    - ${我的节点名字}-IPV6-tls-2053
    - ${我的节点名字}-IPV6-tls-2083
    - ${我的节点名字}-IPV6-tls-2087
    - ${我的节点名字}-IPV6-tls-2096
- name: 非CF节点
  type: select
  proxies:
    - ${我的节点名字}-非CF节点
- name: 漏网之鱼
  type: select
  proxies:
    - DIRECT
    - 🚀 节点选择
    - 非CF节点
rules:
# 策略规则，部分规则需打开${小猫}${咪} mate的使用geoip dat版数据库，比如TG规则就需要，或者自定义geoip的规则订阅
# 这是geoip的规则订阅链接，https://cdn.jsdelivr.net/gh/Loyalsoldier/geoip@release/Country.mmdb
# GPT规则
- DOMAIN-KEYWORD,openai,🚀 节点选择
- DOMAIN-SUFFIX,AI.com,🚀 节点选择
- DOMAIN-SUFFIX,cdn.auth0.com,🚀 节点选择
- DOMAIN-SUFFIX,openaiapi-site.azureedge.net,🚀 节点选择
- DOMAIN-SUFFIX,opendns.com,🚀 节点选择
- DOMAIN-SUFFIX,bing.com,🚀 节点选择
- DOMAIN-SUFFIX,civitai.com,🚀 节点选择
- DOMAIN,bard.google.com,🚀 节点选择
- DOMAIN,ai.google.dev,🚀 节点选择
- DOMAIN,gemini.google.com,🚀 节点选择
- DOMAIN-SUFFIX,googleapis.com,🚀 节点选择
- DOMAIN-SUFFIX,sentry.io,🚀 节点选择
- DOMAIN-SUFFIX,intercom.io,🚀 节点选择
- DOMAIN-SUFFIX,featuregates.org,🚀 节点选择
- DOMAIN-SUFFIX,statsigapi.net,🚀 节点选择
- DOMAIN-SUFFIX,claude.ai,🚀 节点选择
- DOMAIN-SUFFIX,Anthropic.com,🚀 节点选择
- DOMAIN-SUFFIX,opera-api.com,🚀 节点选择
- DOMAIN-SUFFIX,aistudio.google.com,🚀 节点选择
- DOMAIN-SUFFIX,auth0.com,🚀 节点选择
- DOMAIN-SUFFIX,challenges.cloudflare.com,🚀 节点选择
- DOMAIN-SUFFIX,chatgpt.com,🚀 节点选择
- DOMAIN-SUFFIX,client-api.arkoselabs.com,🚀 节点选择
- DOMAIN-SUFFIX,events.statsigapi.net,🚀 节点选择
- DOMAIN-SUFFIX,identrust.com,🚀 节点选择
- DOMAIN-SUFFIX,intercomcdn.com,🚀 节点选择
- DOMAIN-SUFFIX,oaistatic.com,🚀 节点选择
- DOMAIN-SUFFIX,oaiusercontent.com,🚀 节点选择
- DOMAIN-SUFFIX,openai.com,🚀 节点选择
- DOMAIN-SUFFIX,stripe.com,🚀 节点选择
# GPT规则
# - GEOSITE,category-ads,REJECT #简单广告过滤规则，要增加规则数可使用category-ads-all
- GEOSITE,cn,DIRECT #国内域名直连规则
- GEOIP,CN,DIRECT,no-resolve #国内IP直连规则
- GEOSITE,cloudflare,DIRECT #CF域名直连规则
- GEOIP,CLOUDFLARE,DIRECT,no-resolve #CFIP直连规则
- GEOSITE,gfw,🚀 节点选择 #GFW域名规则
- GEOSITE,google,🚀 节点选择 #GOOGLE域名规则
- GEOIP,GOOGLE,🚀 节点选择,no-resolve #GOOGLE IP规则
- GEOSITE,netflix,🚀 节点选择 #奈飞域名规则
- GEOIP,NETFLIX,🚀 节点选择,no-resolve #奈飞IP规则
- GEOSITE,telegram,🚀 节点选择 #TG域名规则
- GEOIP,TELEGRAM,🚀 节点选择,no-resolve #TG IP规则
- MATCH,漏网之鱼
`
}
