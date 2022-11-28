#REMARK


### 주석을 달기 어려운 이유
- 길이의 모호성 => 코드의 가독성을 방해하지 않으면서 코드 이해에 도움을 줄 수 있는 적당선을 찾아야 함

- 업데이트가 쉬워야 함 => 다른 사람이 이해하기 쉽고 변경하기 쉽게 작성해야 함

- 주석의 형식이 통일되어야 함


### 좋은 주석 
- 통일된 형식의 주석


- 구현에 대한 정보 제공

//kk:mm:ss EEE, MMM dd, yyyy 형식
Pattern timeFormat = Pattern.compile("\\d*:\\d:\\d* \\w*, \\w* \\d* \\d*);


- 복잡할 경우 의도를 설명하는 주석 작성

//쓰레드를 많이 생성하여 시스템에 영향을 끼쳐 테스트를 만들도록 함
for(int i=0; i< 25000; i++){
     SomeThread someThread = ThreadBuilder.builder( ).build( );
}


- 주석보다 annotation 사용

스프링 부트의 경우 annotation의 활용률이 높은데 annotation 또한 코드에 대한 설명을 담고 있고 코드 내에서 정의된 곳으로 이동이 가능하기 때문에 주석보다 annotation을 잘 활용하는 것이 좋음


- 결과를 경고하는 주석 작성


- TODO를 기록한 주석 작성


- 코드에서 강조할 부분 주석 작성
