# 🚂 Riaxo Developer Blog - Backend

<div align="center">

![Node.js](https://img.shields.io/badge/Node.js-18.x-339933?style=for-the-badge&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-4.16-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-6.6-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![Railway](https://img.shields.io/badge/Railway-Deploy-0B0D0E?style=for-the-badge&logo=railway&logoColor=white)

**확장 가능한 RESTful API 서버**

[🌐 API Base URL](https://riaxo-developer-blog-backend-production.up.railway.app) | [📖 Frontend Repo](https://github.com/serbi2012/riaxo-developer-blog-frontend) | [🐛 Report Bug](https://github.com/serbi2012/riaxo-developer-blog-backend/issues)

</div>

---

## 📋 목차

- [프로젝트 개요](#-프로젝트-개요)
- [주요 기능](#-주요-기능)
- [기술 스택](#-기술-스택)
- [시스템 아키텍처](#-시스템-아키텍처)
- [API 문서](#-api-문서)
- [디렉토리 구조](#-디렉토리-구조)
- [시작하기](#-시작하기)
- [환경 변수](#-환경-변수)
- [배포](#-배포)

---

## 🎯 프로젝트 개요

Riaxo Developer Blog Backend는 **Node.js**와 **Express.js**를 기반으로 한 RESTful API 서버입니다. MongoDB를 데이터베이스로 사용하며, JWT 인증, Cloudinary 이미지 관리, GitHub OAuth 등의 기능을 제공합니다.

### 핵심 가치

- 🚀 **고성능**: 비동기 처리 및 최적화된 데이터베이스 쿼리
- 🔒 **보안**: JWT 인증, CORS, 환경 변수 관리
- 📦 **확장성**: 모듈화된 구조로 쉬운 기능 확장
- 🛠 **유지보수**: 깔끔한 코드와 명확한 에러 처리
- ☁️ **클라우드 네이티브**: Railway 최적화 배포

---

## ✨ 주요 기능

### 🔐 인증 & 권한
- **GitHub OAuth**: Passport.js 기반 소셜 로그인
- **JWT 토큰**: Access Token + Refresh Token
- **관리자 권한**: 환경 변수 기반 관리자 식별
- **토큰 갱신**: Refresh Token을 통한 자동 갱신

### 📝 콘텐츠 관리
- **포스트 CRUD**: 생성, 조회, 수정, 삭제
- **태그 시스템**: 카테고리 및 태그 관리
- **검색 기능**: 제목, 내용 기반 검색
- **페이지네이션**: 효율적인 데이터 로딩

### 📷 미디어 처리
- **이미지 업로드**: Multer + Cloudinary 연동
- **이미지 최적화**: Sharp를 통한 이미지 처리
- **AI 이미지 생성**: OpenAI DALL-E 연동 (선택)
- **CDN 배포**: Cloudinary 자동 배포

### 🛡 보안
- **CORS 설정**: Origin 기반 접근 제어
- **환경 변수**: dotenv를 통한 보안 키 관리
- **에러 핸들링**: 일관된 에러 응답 형식
- **입력 검증**: 데이터 유효성 검사

---

## 🛠 기술 스택

### Core

```mermaid
graph LR
    A[Node.js 18] --> B[Express.js 4.16]
    B --> C[MongoDB 6.6]
    C --> D[Mongoose ODM]
    D --> E[RESTful API]
    
    style A fill:#339933
    style B fill:#000000
    style C fill:#47A248
    style E fill:#61DAFB
```

| 기술 | 버전 | 용도 |
|------|------|------|
| **Node.js** | 18.x | JavaScript 런타임 |
| **Express.js** | 4.16.1 | 웹 프레임워크 |
| **MongoDB** | 4.10.0 | NoSQL 데이터베이스 |
| **Mongoose** | 6.6.3 | ODM (Object Data Modeling) |

### 인증 & 보안

| 기술 | 용도 |
|------|------|
| **Passport.js** | 인증 미들웨어 |
| **passport-github** | GitHub OAuth 전략 |
| **jsonwebtoken** | JWT 토큰 생성/검증 |
| **cors** | Cross-Origin Resource Sharing |
| **dotenv** | 환경 변수 관리 |

### 미디어 & 외부 서비스

| 기술 | 용도 |
|------|------|
| **Multer** | 파일 업로드 처리 |
| **Cloudinary** | 이미지 CDN & 스토리지 |
| **Sharp** | 이미지 최적화 |
| **OpenAI** | AI 이미지 생성 (선택) |
| **Cheerio** | HTML 파싱 |

### 개발 도구

| 기술 | 용도 |
|------|------|
| **Nodemon** | 개발 서버 자동 재시작 |
| **Morgan** | HTTP 로거 |
| **ESLint** | 코드 린팅 |
| **Prettier** | 코드 포맷팅 |

---

## 🏗 시스템 아키텍처

### 전체 시스템 구조

```mermaid
graph TB
    subgraph "Client Layer"
        A[React Frontend<br/>Vercel]
    end
    
    subgraph "API Layer - Railway"
        B[Express Server]
        C[Router]
        D[Controller]
        E[Middleware]
    end
    
    subgraph "Authentication"
        F[Passport.js]
        G[JWT Strategy]
        H[GitHub OAuth]
    end
    
    subgraph "Data Layer"
        I[(MongoDB Atlas)]
        J[Mongoose Models]
    end
    
    subgraph "External Services"
        K[Cloudinary CDN]
        L[OpenAI API]
    end
    
    A -->|HTTPS Request| B
    B --> C
    C --> D
    C --> E
    E --> F
    F --> G
    F --> H
    D --> J
    J --> I
    D --> K
    D --> L
    
    style A fill:#61DAFB
    style B fill:#339933
    style I fill:#47A248
    style K fill:#3448C5
```

### Express 미들웨어 파이프라인

```mermaid
graph LR
    A[HTTP Request] --> B[Morgan Logger]
    B --> C[CORS]
    C --> D[Body Parser]
    D --> E[Cookie Parser]
    E --> F[Passport Initialize]
    F --> G{Route Match?}
    G -->|Yes| H[Route Handler]
    G -->|No| I[404 Error]
    H --> J{Auth Required?}
    J -->|Yes| K[JWT Verify]
    J -->|No| L[Controller]
    K -->|Valid| L
    K -->|Invalid| M[401 Error]
    L --> N[Response]
    I --> O[Error Handler]
    M --> O
    O --> P[JSON Response]
    
    style A fill:#4ECDC4
    style N fill:#00C853
    style O fill:#FF6B6B
```

### 데이터베이스 스키마

```mermaid
erDiagram
    POST ||--o{ TAG : has
    POST {
        ObjectId _id
        string title
        string content
        string thumbnail
        array tags
        boolean published
        date createdAt
        date updatedAt
    }
    
    TAG {
        ObjectId _id
        string name
        string slug
        number count
        date createdAt
    }
    
    TOKEN {
        ObjectId _id
        string userId
        string refreshToken
        date expiresAt
        date createdAt
    }
    
    POST ||--|| TOKEN : "created_by"
```

### 인증 플로우

```mermaid
sequenceDiagram
    participant C as Client
    participant S as Express Server
    participant P as Passport
    participant G as GitHub
    participant DB as MongoDB
    participant JWT as JWT Service

    C->>S: GET /api/auth/github
    S->>P: Initiate GitHub OAuth
    P->>G: Redirect to GitHub
    G-->>C: GitHub Login Page
    C->>G: User Credentials
    G->>P: Authorization Code
    P->>G: Exchange Code for Token
    G-->>P: Access Token
    P->>G: Get User Profile
    G-->>P: User Data
    P->>S: User Profile
    S->>DB: Check/Create User
    DB-->>S: User Document
    S->>JWT: Generate Tokens
    JWT-->>S: Access + Refresh Token
    S->>DB: Store Refresh Token
    S-->>C: Set Cookies + Redirect
    
    Note over C,DB: Subsequent Requests
    C->>S: API Request + Access Token
    S->>JWT: Verify Token
    JWT-->>S: Token Valid
    S-->>C: Protected Resource
```

### API 요청 흐름

```mermaid
sequenceDiagram
    participant C as Client
    participant R as Router
    participant M as Middleware
    participant Ctrl as Controller
    participant Model as Mongoose Model
    participant DB as MongoDB

    C->>R: POST /api/post
    R->>M: verifyToken
    M->>M: Check JWT
    alt Invalid Token
        M-->>C: 401 Unauthorized
    else Valid Token
        M->>Ctrl: createPost
        Ctrl->>Ctrl: Validate Data
        Ctrl->>Model: Post.create()
        Model->>DB: Insert Document
        DB-->>Model: Created Document
        Model-->>Ctrl: Post Object
        Ctrl-->>C: 201 Created
    end
```

---

## 📚 API 문서

### Base URL

```
Production: https://riaxo-developer-blog-backend-production.up.railway.app
Development: http://localhost:8080
```

### 인증

```mermaid
graph LR
    A[GitHub OAuth] --> B[Authorization Code]
    B --> C[Access Token]
    C --> D[JWT Access Token]
    C --> E[JWT Refresh Token]
    
    style D fill:#4ECDC4
    style E fill:#96CEB4
```

#### GitHub OAuth

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/auth/github` | GitHub 로그인 시작 |
| GET | `/api/auth/github/callback` | GitHub 콜백 |
| POST | `/api/auth/refresh` | 토큰 갱신 |
| POST | `/api/auth/logout` | 로그아웃 |

#### 예시: GitHub 로그인

```javascript
// 1. 프론트엔드에서 GitHub 로그인 시작
window.location.href = 'https://api.yourdomain.com/api/auth/github';

// 2. GitHub 인증 후 콜백
// 3. 서버가 JWT 토큰을 쿠키에 설정
// 4. 프론트엔드로 리다이렉트
```

### 포스트 API

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/post` | ❌ | 포스트 목록 조회 |
| GET | `/api/post/:id` | ❌ | 포스트 상세 조회 |
| POST | `/api/post` | ✅ | 포스트 생성 |
| PUT | `/api/post/:id` | ✅ | 포스트 수정 |
| DELETE | `/api/post/:id` | ✅ | 포스트 삭제 |

#### 예시: 포스트 생성

```http
POST /api/post
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "title": "새로운 포스트",
  "content": "<p>포스트 내용</p>",
  "thumbnail": "https://cloudinary.com/...",
  "tags": ["JavaScript", "React"],
  "published": true
}
```

**응답:**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "title": "새로운 포스트",
    "content": "<p>포스트 내용</p>",
    "thumbnail": "https://cloudinary.com/...",
    "tags": ["JavaScript", "React"],
    "published": true,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### 태그 API

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/tag` | ❌ | 태그 목록 조회 |
| POST | `/api/tag` | ✅ | 태그 생성 |
| DELETE | `/api/tag/:id` | ✅ | 태그 삭제 |

### 이미지 API

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/image/upload` | ✅ | 이미지 업로드 |
| POST | `/api/image/generate` | ✅ | AI 이미지 생성 |

#### 예시: 이미지 업로드

```http
POST /api/image/upload
Authorization: Bearer <access_token>
Content-Type: multipart/form-data

image: [file]
```

**응답:**
```json
{
  "success": true,
  "data": {
    "url": "https://res.cloudinary.com/...",
    "publicId": "blog/abc123"
  }
}
```

### 에러 응답 형식

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "제목은 필수입니다.",
    "details": {
      "field": "title"
    }
  }
}
```

### HTTP 상태 코드

| 코드 | 의미 |
|------|------|
| 200 | 성공 |
| 201 | 생성 성공 |
| 400 | 잘못된 요청 |
| 401 | 인증 실패 |
| 403 | 권한 없음 |
| 404 | 찾을 수 없음 |
| 500 | 서버 오류 |

---

## 📁 디렉토리 구조

```
riaxo-developer-blog-backend/
│
├── bin/
│   └── www                        # 서버 시작 스크립트
│
├── config/
│   ├── environmentVariable.js     # 환경 변수 관리
│   ├── errorHandler.js            # 전역 에러 핸들러
│   ├── mongoDbConnect.js          # MongoDB 연결
│   └── passportConfig.js          # Passport 설정
│
├── constant/
│   └── errorMessage.js            # 에러 메시지 상수
│
├── models/
│   ├── Post.js                    # 포스트 모델
│   ├── Tag.js                     # 태그 모델
│   └── Token.js                   # 토큰 모델
│
├── routes/
│   ├── index.js                   # 메인 라우터
│   ├── auth.js                    # 인증 라우터
│   ├── post.js                    # 포스트 라우터
│   ├── tag.js                     # 태그 라우터
│   ├── image.js                   # 이미지 라우터
│   │
│   ├── controllers/
│   │   ├── auth.controller.js    # 인증 컨트롤러
│   │   ├── post.controller.js    # 포스트 컨트롤러
│   │   ├── tag.controller.js     # 태그 컨트롤러
│   │   └── image.controller.js   # 이미지 컨트롤러
│   │
│   └── middlewares/
│       ├── verifyToken.js        # JWT 검증 미들웨어
│       └── imageUploader.js      # 이미지 업로드 미들웨어
│
├── .env                           # 환경 변수 (로컬)
├── .gitignore                     # Git 무시 파일
├── app.js                         # Express 앱 설정
├── package.json                   # 의존성 관리
├── railway.json                   # Railway 배포 설정
└── nixpacks.toml                  # Nixpacks 빌드 설정
```

### 코드 구조 패턴

```mermaid
graph TB
    subgraph "Layered Architecture"
        A[Route Layer] --> B[Controller Layer]
        B --> C[Service Layer]
        C --> D[Model Layer]
        D --> E[(Database)]
    end
    
    subgraph "Cross-Cutting Concerns"
        F[Middleware]
        G[Error Handler]
        H[Config]
    end
    
    F -.-> A
    G -.-> B
    H -.-> D
    
    style A fill:#4ECDC4
    style B fill:#45B7D1
    style C fill:#96CEB4
    style D fill:#FFEAA7
    style E fill:#47A248
```

---

## 🚀 시작하기

### 필수 요구사항

```mermaid
graph LR
    A[Node.js 18+] --> D[개발 환경]
    B[MongoDB] --> D
    C[npm/yarn] --> D
    
    style D fill:#00C853
```

- **Node.js**: 18.x 이상
- **MongoDB**: 4.x 이상 (또는 MongoDB Atlas)
- **npm**: 8.x 이상

### 설치

```bash
# 1. 저장소 클론
git clone https://github.com/serbi2012/riaxo-developer-blog-backend.git
cd riaxo-developer-blog-backend

# 2. 의존성 설치
npm install

# 3. 환경 변수 설정
cp .env.example .env
# .env 파일 편집

# 4. 개발 서버 시작
npm run dev
```

---

## 🔐 환경 변수

### 필수 환경 변수

```env
# Server
PORT=8080
NODE_ENV=development

# Database
DB_URI=mongodb+srv://username:password@cluster.mongodb.net/riaxo-blog

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# GitHub OAuth
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
GITHUB_CALLBACK_URL=http://localhost:8080/api/auth/github/callback

# JWT
JWT_SECRET=your_jwt_secret_here
JWT_REFRESH_SECRET=your_jwt_refresh_secret_here

# Admin
ADMIN_ID=your_github_username

# Frontend URL (CORS)
FRONTEND_URL=http://localhost:5173
```

### 환경 변수 설명

| 변수명 | 설명 | 예시 |
|--------|------|------|
| `PORT` | 서버 포트 | `8080` |
| `NODE_ENV` | 환경 (development/production) | `production` |
| `DB_URI` | MongoDB 연결 문자열 | `mongodb+srv://...` |
| `CLOUDINARY_*` | Cloudinary 자격 증명 | - |
| `GITHUB_*` | GitHub OAuth 설정 | - |
| `JWT_SECRET` | JWT 시크릿 키 (64자 이상 권장) | - |
| `ADMIN_ID` | 관리자 GitHub 사용자명 | `serbi2012` |
| `FRONTEND_URL` | 프론트엔드 URL (CORS용) | `https://...vercel.app` |

### JWT Secret 생성

```bash
# Node.js로 안전한 랜덤 키 생성
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

---

## 🚢 배포

### Railway 배포 플로우

```mermaid
graph LR
    A[Git Push] --> B[Railway Detect]
    B --> C[Build Start]
    C --> D[npm install]
    D --> E[Start Server]
    E --> F[Health Check]
    F -->|Success| G[Deploy Complete]
    F -->|Fail| H[Rollback]
    
    style A fill:#4ECDC4
    style G fill:#00C853
    style H fill:#FF6B6B
```

### 자동 배포 (GitHub 연동)

```bash
# 코드 푸시하면 자동 배포
git add .
git commit -m "feat: 새 기능 추가"
git push origin main

# Railway가 자동으로:
# 1. GitHub webhook 감지
# 2. 코드 다운로드
# 3. 의존성 설치
# 4. 서버 시작
# 5. 헬스 체크
# 6. 배포 완료
```

### Railway 설정

**railway.json:**
```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "npm start",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

**nixpacks.toml:**
```toml
[phases.setup]
nixPkgs = ["nodejs-18_x"]

[phases.install]
cmds = ["npm ci"]

[start]
cmd = "npm start"
```

### 환경 변수 설정 (Railway)

Railway Dashboard → Variables:

```env
PORT=8080
NODE_ENV=production
DB_URI=mongodb+srv://...
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
GITHUB_CLIENT_ID=...
GITHUB_CLIENT_SECRET=...
GITHUB_CALLBACK_URL=https://your-app.railway.app/api/auth/github/callback
JWT_SECRET=...
JWT_REFRESH_SECRET=...
ADMIN_ID=serbi2012
FRONTEND_URL=https://riaxo-developer-blog-frontend-fsrxuitvq.vercel.app
```

### 배포 확인

```bash
# API 테스트
curl https://riaxo-developer-blog-backend-production.up.railway.app/

# Health check
curl https://riaxo-developer-blog-backend-production.up.railway.app/api/health
```

---

## 🧪 개발 스크립트

```bash
# 개발 서버 (nodemon)
npm run dev

# 프로덕션 서버
npm start

# 린트 검사
npm run lint

# 코드 포맷팅
npm run format
```

---

## 🐛 트러블슈팅

### MongoDB 연결 실패

```bash
# 1. MongoDB Atlas Network Access 확인
# 0.0.0.0/0 허용 확인

# 2. 연결 문자열 확인
# 특수문자 URL 인코딩 확인

# 3. 데이터베이스 이름 확인
# URI에 데이터베이스 이름 포함 확인
```

### CORS 에러

```javascript
// app.js에서 CORS 설정 확인
const cors_options = {
    origin: function (origin, callback) {
        if (!origin) return callback(null, true);
        
        const allowed_origins = ENV_VAR.FRONTEND_URL.split(',');
        const is_vercel_preview = origin.includes('vercel.app');
        const is_allowed = allowed_origins.some(allowed => origin === allowed.trim());
        
        if (is_allowed || is_vercel_preview) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
};
```

### Railway 배포 실패

```bash
# 1. Railway 로그 확인
# Dashboard → Deployments → View Logs

# 2. 환경 변수 확인
# Dashboard → Variables

# 3. package.json scripts 확인
# "start": "node ./bin/www"
```

---

## 📈 성능 최적화

### 데이터베이스 인덱싱

```javascript
// models/Post.js
PostSchema.index({ title: 'text', content: 'text' });
PostSchema.index({ createdAt: -1 });
PostSchema.index({ tags: 1 });
```

### 쿼리 최적화

```javascript
// ✅ Good - 필요한 필드만 선택
const posts = await Post.find()
  .select('title thumbnail createdAt')
  .limit(10);

// ❌ Bad - 모든 필드 조회
const posts = await Post.find().limit(10);
```

### 캐싱 전략

```mermaid
graph LR
    A[Client Request] --> B{Cache Hit?}
    B -->|Yes| C[Return Cached]
    B -->|No| D[Query Database]
    D --> E[Store in Cache]
    E --> F[Return Result]
    
    style C fill:#00C853
    style F fill:#00C853
```

---

## 📄 라이선스

MIT License

---

## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'feat: Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📞 문의

- **GitHub**: [@serbi2012](https://github.com/serbi2012)
- **Repository**: [Backend](https://github.com/serbi2012/riaxo-developer-blog-backend) | [Frontend](https://github.com/serbi2012/riaxo-developer-blog-frontend)
- **Issue**: [Report Bug](https://github.com/serbi2012/riaxo-developer-blog-backend/issues)

---

## 🔗 관련 링크

- **API Base URL**: https://riaxo-developer-blog-backend-production.up.railway.app
- **Frontend**: https://riaxo-developer-blog-frontend-fsrxuitvq.vercel.app
- **Railway Dashboard**: https://railway.app

---

<div align="center">

**Made with ❤️ by Riaxo**

[⬆ Back to top](#-riaxo-developer-blog---backend)

</div>

