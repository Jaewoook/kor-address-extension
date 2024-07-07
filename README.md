<div align="center">
  <img alt="kor-address-extension logo" src="/images/icon_128.png" />
<h1>주소검색 확장 프로그램</h1>

![CircleCI](https://img.shields.io/circleci/build/github/Jaewoook/kor-address-extension?style=flat-square)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](https://github.com/Jaewoook/kor-address-extension/pulls)
![GitHub License](https://img.shields.io/github/license/Jaewoook/kor-address-extension?color=brightgreen&style=flat-square)
![Chrome Web Store](https://img.shields.io/chrome-web-store/v/kiamcbcponnlbnanbbfnfdjhioebpiah?style=flat-square)
![Mozilla Add-on](https://img.shields.io/amo/v/kor-address-extension?style=flat-square)
![whale store](https://img.shields.io/github/package-json/v/Jaewoook/kor-address-extension?label=whale%20store&style=flat-square)

</div>

## 프로젝트 소개

해외 사이트에 영문 주소 입력을 할 때마다 매번 영문 주소 변환 사이트에서 주소 검색 후 복사하는게 불편했습니다. 그 뿐만 아니라 매번 헷갈리는 우편번호, 도로명주소 등을 검색하는 것까지 편하게 할 수 있으면 좋을 것 같다는 생각에 이 프로젝트를 시작하게 됐습니다.  
주소 검색은 [도로명주소 오픈 API](https://www.juso.go.kr/)를 이용하여 구현했습니다.

## 데모

주소검색 확장 프로그램의 사용 데모입니다.

![Demo GIF](/images/demo.gif)

## 지원 브라우저

사용하는 브라우저의 스토어에서 바로 다운로드하세요!

| 브라우저 | 상태 | 다운로드 |
|--------|:---:|-------|
| Google Chrome | :heavy_check_mark: | [크롬 웹 스토어로 이동](https://chrome.google.com/webstore/detail/%EC%A3%BC%EC%86%8C%EA%B2%80%EC%83%89/kiamcbcponnlbnanbbfnfdjhioebpiah) |
| NAVER Whale | :heavy_check_mark: | [웨일 스토어로 이동](https://store.whale.naver.com/detail/pidjpaocfolbbaminggjijheckcdfcdj) |
| Mozilla Firefox | :warning: | ~~[Firefox Add-ons으로 이동](https://addons.mozilla.org/ko/firefox/addon/kor-address-extension/)~~ |

### 기타 브라우저

스토어에서 아래 **수동으로 설치하기**의 공통 섹션과 브라우저별 확장 프로그램 설치 방법 참조

> [!IMPORTANT]
> 브라우저는 WebExtension API를 지원해야 합니다. 주소검색 프로젝트는 WebExtension spec을 준수하지만 안정적인 동작을 보장하지는 않습니다.

## 직접 빌드하기

프로젝트 소스 코드를 로컬 환경에 다운로드 받고, 직접 빌드하여 사용할 수 있습니다.

먼저, 이 저장소를 다운로드 하고 의존성 설치를 합니다.

```bash
git clone https://github.com/Jaewoook/kor-address-extension
cd kor-address-extension && yarn
```

그리고, 패키지 스크립트를 실행합니다.

```bash
yarn build && yarn package
```

### Google Chrome 및 NAVER Whale 브라우저

1. <chrome://extensions> 페이지에 접속합니다. (Whale은 <whale://extensions> 통해서도 접속 가능)
2. 개발자 모드가 활성화되어 있지 않다면, 활성화합니다.
3. `Load unpacked` 버튼을 클릭해 프로젝트 루트의 **dist 폴더**를 추가합니다.

### Firefox 브라우저

1. <about:debugging> 페이지에 접속합니다.
2. This Firefox 메뉴 선택을 합니다.
3. `Load Temporary Add-on...` 버튼을 클릭해 프로젝트 루트의 **dist.zip 파일**을 추가합니다.

## 제작자

[Jaewook Ahn](https://github.com/Jaewoook)

## 저작권

이 프로젝트는 [MIT 라이선스](./LICENSE)를 따릅니다.
