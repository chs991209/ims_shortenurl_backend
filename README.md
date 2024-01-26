# URL Shortening Service

## 길이가 긴 Url을 간단한 url로 바꿔서 공유하며 사용해 보세요 🎈

### 백엔드 - [최현수](https://github.com/chs991209), [김문영](https://github.com/kimmunyeong)
### 프론트엔드 - [정현용](https://github.com/boikun)


# Proejct - 3.COM
## 소개
### <p style="color: dodgerblue">위코드 50기 기업 협업 프로젝트</p>

#### 백엔드 서버 코드를 저장했습니다. Frontend 소스 코드는 [여기]([](https://github.com/boikun77/ims_internship_wecode50_frontend))에 있습니다.

## 저장소 구조

```
├── nest-cli.json
├── package.json
├── src
│   ├── app.controller.spec.ts
│   ├── app.controller.ts
│   ├── app.module.ts
│   ├── app.service.ts
│   ├── auth
│   │   └── auth.middleware.ts
│   ├── ims.we
│   │   ├── dto
│   │   ├── entities
│   │   │   └── ims.we.entity.ts
│   │   ├── ims.we.controller.spec.ts
│   │   ├── ims.we.controller.ts
│   │   ├── ims.we.module.ts
│   │   ├── ims.we.service.spec.ts
│   │   └── ims.we.service.ts
│   ├── main.ts
│   ├── middleware
│   │   ├── auth.module.ts
│   │   ├── dto
│   │   │   └── authDto.ts
│   │   ├── guard.ts
│   │   └── passport.jwt.ts
│   ├── urls
│   │   ├── dto
│   │   │   ├── create-qrcode.ts
│   │   │   ├── create-url.dto.ts
│   │   │   ├── get-original-url.dto.ts
│   │   │   ├── get-url.dto.ts
│   │   │   └── update-url.dto.ts
│   │   ├── entities
│   │   │   └── url.entity.ts
│   │   ├── urls.controller.spec.ts
│   │   ├── urls.controller.ts
│   │   ├── urls.module.ts
│   │   ├── urls.service.spec.ts
│   │   └── urls.service.ts
│   └── users
│       ├── entities
│       │   └── users.entity.ts
│       ├── users.controller.spec.ts
│       ├── users.controller.ts
│       ├── users.module.ts
│       ├── users.service.spec.ts
│       └── users.service.ts
├── test
│   ├── app.e2e-spec.ts
│   └── jest-e2e.json
├── tsconfig.build.json
├── tsconfig.json
└── yarn.lock


```
- 백엔드 저장소 구조는 위와 같습니다.

## 기술스택
### Backend: [Nest.js](http://docs.nestjs.com)
### Frontend: [Next.js](https://nextjs.org)


<div align="center">
<a href="https://ibb.co/gWC9qB4"><img src="https://i.ibb.co/dpyMCzm/1-R-x-BQ6-JIvu-Lz-JNYJh-YW5wg.png" alt="1-R-x-BQ6-JIvu-Lz-JNYJh-YW5wg" border="0" height="400px"></a>
  <p></p>
<img src="https://img.shields.io/badge/typescript-2E79C7?style=for-the-badge&logo=typescript&logoColor=white">
<img src="https://img.shields.io/badge/mysql-4479A1?style=for-the-badge&logo=mysql&logoColor=white">
<img src="https://img.shields.io/badge/node.js-339933?style=for-the-badge&logo=Node.js&logoColor=white">
<img src="https://img.shields.io/badge/Swagger-339933?style=for-the-badge&logo=Swagger&logoColor=black">
<img src="https://img.shields.io/badge/typeorm-ffffff?style=for-the-badge&logo=typeorm&logoColor=white">
<img src="https://img.shields.io/badge/plantuml-ffffff?style=for-the-badge&logo=plantuml&logoColor=black">

<br>
<img src="https://img.shields.io/badge/nextjs-ffffff?style=for-the-badge&logo=nextjs&logoColor=white">
<img src="https://img.shields.io/badge/html5-E34F26?style=for-the-badge&logo=html5&logoColor=white">
<img src="https://img.shields.io/badge/css-1572B6?style=for-the-badge&logo=css3&logoColor=white">
<img src="https://img.shields.io/badge/sourcetree-0053CD?style=for-the-badge&logo=sourcetreee&logoColor=white">
</div>

# 프로젝트
## 설치하기
0. yarn을 설치해 주세요.
    ```
    brew install yarn
    ```
    ```
    yarn -v
    ```
    - 명령어를 입력했을 때 **1.22.21** 미만이면 버전 업그레이드를 진행해주세요.
1. nestjs cli 10.2.1 버전을 설치해 주세요.
    ```
    sudo npm -i g @nestjs/cli@10.2.1
    ```

2. 백엔드 저장소를 클론해주세요.
    ```
    git clone https://github.com/chs991209/ims_shortenurl_backend
    ```
3. yarn 패키지를 설치해 주세요.
    ```
    yarn install
    ```
    - 명령어는 디렉토리 최상단에서 실행해주세요.
    - pkg list는 package.json에서 확인하시면 됩니다.
 <p></p>

4. dbmate를 (brew로도 설치 가능) 글로벌 설치하여 db 설치를 진행해 주세요
    ```
    $ brew install -g dbmate
    $ npm install dbmate
    ```
    - dbmate를 설치하였으면 mysql 설치를 진행합니다. username과 password를 지정하고 사용할 database를 생성해 줍니다.
    - Project 폴더 내에 .env 파일을 생성합니다.
   ```
   DATABASE_URL="protocol(ex.mysql)://username:password@host:port/DATABASE_NAME"
   ```
    - .env 파일 내에 위 내용을 추가해 줍니다. sql 파일을 Repo에서 내려받습니다.

   ```
   mkdir db
   ```
    - 클론받은 directory 최상단에서 db 폴더를 생성해 줍니다.
    - <p>클론받은 sql 파일을 db 폴더 내의 <span style="color: dodgerblue"> repo의 순서와 동일하게</span> 넣어 줍니다.</p>

   ```
   dbmate up
   ```
   dbmate와 관련된 설명은 [여기](https://github.com/amacneil/dbmate)에서 볼 수 있습니다(공식 문서).



## 실행하기
- 아래 명령어를 입력하여 실행해주세요.
    ```
    yarn start:dev
    ```
    - 명령어는 디렉토리 최상단에서 실행해주세요.

# 기여하기
위코드 50기 팀원 총 3명이 참여하였습니다.

프론트엔드 1명, 백엔드 2명이 참여하였습니다.

현재 기여하기는 팀원들을 통해서만 가능하니, 추가 코드 수정은 팀원을 통해 추후 진행할 예정입니다.

# 벤치마킹 Platform

### Url Shortening Service Bitly를 벤치마킹하였습니다.
- 줄여진 주소를 입력하면 원본 url로 이동하도록 호스팅해 주는 기능을 참고하였습니다.


<p align="center"><a href="https://ibb.co/7N8cpQp"><img src="https://i.ibb.co/6JVht8t/2023-12-26-11-10-37.png" alt="Bitly 사이트 메인" border="0"></a>

## 벤치마킹 포인트 👀

### 회원과 비회원의 공통된 기능
- bitly는 비회원은 기능을 이용할 수가 없습니다.
- 비회원은 24시간동안 10회, 회원은 무제한으로 사용할 수 있도록 기능을 구성하였습니다.
- 회원의 결제 멤버십에 따른 기능 확장은 추후에 추가하도록 정하였습니다.
- 비회원, 회원 모두 원본 url로 이동시키는 qrcode 이미지 생성을 할 수 있습니다.


### 마이페이지에서 url 생성 기록 조회
- 로그인한 회원이 마이페이지에 접근하여 과거의 URL 생성 History를 볼 수 있습니다.


<p align="center"><img src="" alt="파일이 잠시 누락됐습니다!" border="0">


# Dev Story
## 기여한 사람들

| [🍑 Munyeong](https://github.com/kimmunyeong) | [🥑 Hyunsu](https://github.com/chs991209) | [🍇 Hyeonyong](https://github.com/boikun) |
|-----------------------------------------------|-------------------------------------------|-------------------------------------------|

## Dev Note

Server 관련 google docs는 [여기](https://docs.google.com/document/d/1CBkvxXVtHYlyvPpF6eZguyJK4F0RgescGZFjqUuxkNw/edit)에 있습니다.

저장소에 별 달아주세요 ✨✨✨
