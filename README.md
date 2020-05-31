![logo](/icons/icon_128.png)

# kor-address-extension

[![CircleCI](https://circleci.com/gh/Jaewoook/kor-address-extension.svg?style=shield)](https://circleci.com/gh/Jaewoook/kor-address-extension)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat)](https://github.com/Jaewoook/kor-address-extension/pulls)
[![GitHub license](https://img.shields.io/github/license/Jaewoook/kor-address-extension.svg?color=brightgreen&style=flat)](https://github.com/Jaewoook/kor-address-extension/blob/master/LICENSE)
![Chrome Web Store](https://img.shields.io/chrome-web-store/v/kiamcbcponnlbnanbbfnfdjhioebpiah)

## 프로젝트 소개

해외 사이트에 영문 주소 입력을 할 때마다 매번 영문 주소 변환 사이트에서 주소 검색 후 복사하는게 불편했습니다. 그 뿐만 아니라 매번 햇갈리는 우편번호, 도로명주소 등을 검색하는 것까지 편하게 할 수 있으면 좋을 것 같다는 생각에 이 프로젝트를 시작하게 됐습니다.

## 데모

![Demo GIF](/images/demo.gif)

[![download](https://developer.chrome.com/webstore/images/ChromeWebStore_BadgeWBorder_v2_340x96.png)](https://chrome.google.com/webstore/detail/%EC%A3%BC%EC%86%8C%EA%B2%80%EC%83%89/kiamcbcponnlbnanbbfnfdjhioebpiah)

## 구현 예정 기능

- 검색 결과 페이지네이션

## 수동으로 크롬에 설치하기

먼저, 이 저장소를 클론하고 의존성 설치를 합니다.

```sh
git clone https://github.com/Jaewoook/kor-address-extension
cd kor-address-extension && yarn
```

그리고, 패키지 스크립트를 실행합니다. (자동으로 빌드 후 패키지 과정 실행)

```sh
yarn package
```

마지막으로, [크롬 익스텐션 페이지](chrome://extensions/)에 접속해 개발자 모드를 활성화하고, 프로젝트 루트의 dist 폴더를 추가합니다.


## 제작자

- Jaewook Ahn <ajw4586@gmail.com>

## 저작권

MIT ([LICENSE](https://github.com/Jaewoook/kor-address-extension/blob/master/LICENSE) 파일 참고)