# code-server container を使う

## 起動方法

```
docker build . -t vtetris
docker run -it -p 3001:3001 -e PASSWORD=password -e PORT=3001 vtetris
```
