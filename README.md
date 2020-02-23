# honey-jan-export
find words from word docs and export a excel

### Installation:

下载node环境，然后下一步下一步安装。

安装包：

```
$ http://nodejs.cn/download/

windows选择 $ Windows 安装包 (.msi) 64位
mac选择  $ macOS 安装包 (.pkg)

安装完成后，打开系统黑色小窗口。

首先输入

$ node -v

查看是否安装完成。如果返回版本号，就是安装成功。 安装完成后，执行下列命令
```

```
$ npm install -g honey-jan-export
$ cd '进入你本地文档所在的文件夹'
$ honey-jan-export words="北大集团|清华集团"
```

### Other params:
* port: 自定义端口号， 默认是3000
* dir: 自定义目录， 默认在当前执行命令目录下
* key: 变量名, 以|隔开

eg.
```javascript
honey-jan-export words='test1|test2|test3'
```
