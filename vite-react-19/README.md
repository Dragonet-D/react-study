## 1, 背景

![图片](./imgs/image.png)

## 2, 是什么

是一个 babel 插件, babel-plugin-react-compiler

## 3, 工作原理

React Forget 可以生成等效于 useMemo、React.memo 的代码，并不意味着编译后的代码会出现上述 API，而是会出现「效果等效于上述 API」的辅助代码。

```react
function VideoTab({heading, videos, filter}) {
  const filterdList = [];
  for (const video of videos) {
    if (applyFilter(video, filter)) {
      filterdList.push(video);
    }
  }
  if (filterdList.length === 0) {
    return <NoVideos />;
  }

  return (
    <>
      <Heading
        heading={heading}
        count={filterdList.length}
      />
      <VideoList videos={filterdList} />
    </>
  )
}
```