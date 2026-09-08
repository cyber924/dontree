# 돈트리대부중개 배포 안내

## GitHub와 Vercel

1. 이 폴더의 파일을 새 GitHub 저장소에 모두 업로드합니다.
2. Vercel에서 `Add New Project`를 선택하고 해당 저장소를 연결합니다.
3. Framework Preset은 `Other`로 두고 배포합니다.
4. Vercel 프로젝트의 Settings → Environment Variables에 `GEMINI_API_KEY`를 등록합니다.
5. Settings → Domains에서 `dontree.co.kr`과 `www.dontree.co.kr`을 추가합니다.
6. Vercel이 안내하는 DNS 값을 도메인 등록업체 DNS에 설정합니다.

## Firebase

- Firebase Authentication → Settings → Authorized domains에 `dontree.co.kr`과 `www.dontree.co.kr`을 추가합니다.
- Firestore 규칙은 저장소의 `firestore.rules` 내용을 Firebase Console에서 게시합니다.

## 검색 등록

- 도메인 연결이 완료된 뒤 Google Search Console에 `dontree.co.kr` 도메인 속성을 등록합니다.
- 사이트맵 주소는 `https://dontree.co.kr/sitemap.xml`입니다.
- 네이버 서치어드바이저에도 같은 도메인과 사이트맵을 등록합니다.
