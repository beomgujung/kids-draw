import { ScrollViewStyleReset, useServerDocumentContext } from 'expo-router/html';
import { type PropsWithChildren } from 'react';

// 웹 전용 HTML 틀 (서버에서만 실행된다).
// 유아용 앱이라 글자 선택이 필요 없고, 웹에서는 누르다 살짝 끌기만 해도 글자가 선택되며
// react-native-web 이 그 클릭(onPress)을 취소하므로 전체에서 선택을 끈다.
const globalStyle = `
body {
  -webkit-user-select: none;
  user-select: none;
  -webkit-touch-callout: none;
}
`;

export default function Root({ children }: PropsWithChildren) {
  const { htmlAttributes, bodyAttributes, headNodes, bodyNodes } = useServerDocumentContext();
  return (
    <html lang="ko" {...htmlAttributes}>
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
        <ScrollViewStyleReset />
        <style dangerouslySetInnerHTML={{ __html: globalStyle }} />
        {headNodes}
      </head>
      <body {...bodyAttributes}>
        {children}
        {bodyNodes}
      </body>
    </html>
  );
}
