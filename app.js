//����� ������ ����
var express = require('express');//express ��� ��ü�� ����
var app = express();
var server = require('http').createServer(app);

//socket.io ���Ը� ����
var io = require('socket.io').listen(server);

//���� ó���� ���� fs��ü�� ����
var fs = require('fs');

//��� ó���� ���� path ��ü�� ����
var path = require('path');

//===��Ʈ ���� 
app.set('port', 3000);//��Ʈ ����

//===favicon ���� 
app.use(express.favicon());//app.use(express.favicon(__dirname +'��� ')); <- �̷��Ե� favicon ������ �� �� ����

//POST������ ���� �� post body ������ �б� 
app.use(express.bodyParser());

//static ������ ���񽺸� ���� ��� ����
app.use(express.static(path.join(__dirname, 'public')));

//App ����
//������ ���� ������ �����մϴ�.
app.start = app.listen = app.aaa = function(){
	return server.listen.apply(server, arguments)
}
app.start(app.get('port'),function(){//aaa???
	console.log("Server Start");
});
//app.js���� �������� ���̱� ���� ������ ���� config�� service���丮�� �������. 
// ���� ���� include �Լ� 
//fs��ü�� �̿��Ͽ� file include����� �̿��ϴ°�

function include(file_) {
	with (global) {
		eval(fs.readFileSync(file_) + '');
	};
};

// config/include ���� �߰�
include(__dirname + "/config/include.js")

// ���� ���� �߰� 
for(var i = 0 ; i < servicefile.length ; i++){
	include(__dirname + "/service/" + servicefile[i] );
}

// ��� http ��û �� ����� �����Ƿ� ��ü���� ó���� �ʿ��� �κе��� �� �κп��� ó�� 
app.all('*', function(req, res, next){
	next();
});
 