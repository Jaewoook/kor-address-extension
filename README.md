![logo](/icons/icon_128.png)

# kor-address-extension

[![CircleCI](https://circleci.com/gh/Jaewoook/kor-address-extension.svg?style=shield)](https://circleci.com/gh/Jaewoook/kor-address-extension)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat)](https://github.com/Jaewoook/kor-address-extension/pulls)
[![GitHub license](https://img.shields.io/github/license/Jaewoook/kor-address-extension.svg?color=brightgreen&style=flat)](https://github.com/Jaewoook/kor-address-extension/blob/master/LICENSE)
![Chrome Web Store](https://img.shields.io/chrome-web-store/v/kiamcbcponnlbnanbbfnfdjhioebpiah)
![Mozilla Add-on](https://img.shields.io/amo/v/주소검색)
![whale store](https://img.shields.io/badge/whale_store-support_soon-blue)

## 프로젝트 소개

해외 사이트에 영문 주소 입력을 할 때마다 매번 영문 주소 변환 사이트에서 주소 검색 후 복사하는게 불편했습니다. 그 뿐만 아니라 매번 햇갈리는 우편번호, 도로명주소 등을 검색하는 것까지 편하게 할 수 있으면 좋을 것 같다는 생각에 이 프로젝트를 시작하게 됐습니다.  
주소 검색은 [도로명주소 오픈 API](https://www.juso.go.kr/)를 이용하여 구현했습니다.

## 데모

![Demo GIF](/images/demo.gif)

## 지원 브라우저

### Google Chrome

[![download](https://developer.chrome.com/webstore/images/ChromeWebStore_BadgeWBorder_v2_340x96.png)](https://chrome.google.com/webstore/detail/%EC%A3%BC%EC%86%8C%EA%B2%80%EC%83%89/kiamcbcponnlbnanbbfnfdjhioebpiah)

### Firefox

- 심사중

### NAVER Whale

- 등록 예정

## 구현 예정 기능

- 검색 결과 페이지네이션 (👨‍💻 Working In Progress...)
- 검색 결과에 따라 동적으로 팝업 높이 조정

## 수동으로 설치하기

### 공통

먼저, 이 저장소를 클론하고 의존성 설치를 합니다.

```sh
git clone https://github.com/Jaewoook/kor-address-extension
cd kor-address-extension && yarn
```

그리고, 패키지 스크립트를 실행합니다. (자동으로 빌드 후 패키지 과정 실행)

```sh
yarn package
```

### Google Chrome 및 NAVER Whale 브라우저

1. <chrome://extensions> 페이지에 접속합니다. (Whale은 <whale://extensions> 통해서도 접속 가능)
2. 개발자 모드가 활성화되어 있지 않다면, 활성화합니다.
3. **Load unpacked 버튼**을 클릭해 프로젝트 루트의 **dist 폴더**를 추가합니다.

### Firefox 브라우저

1. <about:debugging> 페이지에 접속합니다.
2. **This Firefox** 메뉴 선택을 합니다.
3. **Load Temporary Add-on... 버튼**을 클릭해 프로젝트 루트의 **dist.zip 파일**을 추가합니다.

## 제작자

- Jaewook Ahn <ajw4586@gmail.com>

## 저작권

MIT ([LICENSE](https://github.com/Jaewoook/kor-address-extension/blob/master/LICENSE) 파일 참고)