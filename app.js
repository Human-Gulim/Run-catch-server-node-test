//모듈을 변수에 저장
var express = require('express');//express 모듈 객체를 생성
var app = express();
var server = require('http').createServer(app);

//socket.io 개게를 생성
var io = require('socket.io').listen(server);

//파일 처리를 위한 fs객체를 생성
var fs = require('fs');

//경로 처리를 위한 path 객체를 생성
var path = require('path');

//===포트 설정 
app.set('port', 3000);//포트 생성

//===favicon 설정 
app.use(express.favicon());//app.use(express.favicon(__dirname +'경로 ')); <- 이렇게도 favicon 설정을 할 수 있음

//POST전송을 받을 때 post body 데이터 읽기 
app.use(express.bodyParser());

//static 파일의 서비스를 위한 경로 설정
app.use(express.static(path.join(__dirname, 'public')));

//App 실행
//다음과 같이 서버를 실행합니다.
app.start = app.listen = app.aaa = function(){
	return server.listen.apply(server, arguments)
}
app.start(app.get('port'),function(){//aaa???
	console.log("Server Start");
});
//app.js와의 의존성을 줄이기 위해 폴더를 보면 config와 service디렉토리를 만들었다. 
// 서비스 파일 include 함수 
//fs객체를 이용하여 file include방식을 이용하는것

function include(file_) {
	with (global) {
		eval(fs.readFileSync(file_) + '');
	};
};

// config/include 파일 추가
include(__dirname + "/config/include.js")

// 서비스 파일 추가 
for(var i = 0 ; i < servicefile.length ; i++){
	include(__dirname + "/service/" + servicefile[i] );
}

// 모든 http 요청 은 여기로 들어오므로 전체적인 처리가 필요한 부분들은 이 부분에서 처리 
app.all('*', function(req, res, next){
	next();
});
 