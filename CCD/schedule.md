# 调度适配问题及相关解决方法
在工厂环境下，和产线调度人员沟通时，可能会遇到一些适配问题。以下是一些常见的问题及其解决方法     

## 适配问题详细说明
配置的CCD拍照地址是http: //IP:端口/CaptureImage，    
当CCD部署好了后，访问http: //IP:端口/CaptureImage         会返回拍照识别结果    
http: //{ip}:{port}/CaptureImage/{group}       
ip:         ccd的本机ip        
port:     ccd的服务端口         
group:   ccd的组(工位1或工位2, 可自定义), 如果只有1个工位, 则为空   
双工位时，通过设置{group}，可以单独对该工位进行拍照识别，如http: //{ip}:{port}/CaptureImage/1          
![获取相机信息失败提示框截图](./images/dispatch.jpg)   

## 问题日志
2025.12.19   