# Query Request

## Login
로그인

### METHOD
GET

### URL
/api/login

### Request
None

### Response
Your own

## Mentoring List
메인 페이지에서 호출됨.

### METHOD
GET

### URL
/api/mentoring_list

### Request
accessToken : string 

### Response
mentoringData : Mentoring[]

## Ranking
랭킹 페이지에서 호출됨.

### METHOD
GET

### URL
/api/ranking

### Request
accessToken : string 

### Response
rankingData : Mentoring[] (sorted)

## Mentoring Information
멘토링 정보를 불러옴.

### METHOD
GET

### URL
/api/mentoring_info

### Request
accessToken : string  
mentoringId : number

### Response
mentoringData : Mentoring