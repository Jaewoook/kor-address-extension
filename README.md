# kor-address-extension

## 프로젝트 소개

해외 사이트에 주소 입력을 할 때마다 매번 영문 주소 변환 사이트에서 주소 검색 후 복사하는게 불편했습니다. 그래서 주소 검색 후 복사까지 해주는 이 프로젝트를 시작하게 됐습니다.

## 데모

![Demo GIF](/demo.gif)

## 미구현 기능

- 검색 결과 필터
- 검색 결과 페이지네이션

## 수동으로 크롬에 설치하기

먼저, 이 저장소를 클론하고 의존성 설치를 합니다.

```sh
git clone https://github.com/Jaewoook/kor-address-extension
cd kor-address-extension && yarn
```

그리고, 빌드와 패키지 명령어를 실행합니다.

```sh
yarn package
```

마지막으로, [크롬 익스텐션 페이지](chrome://extensions/)에 접속해 개발자 모드를 활성화하고, 프로젝트 루트의 build 폴더를 추가합니다.


## 만든이

- Jaewook Ahn (<ajw4586@gmail.com>)

## License

MIT (see LICENSE file)