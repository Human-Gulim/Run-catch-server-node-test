/**
 * Chat Server Source
 * http://stackoverflow.com/questions/8636775/socket-io-using-the-name-in-makes-webstorm-ide-raise-error
 * 
 * 에러가 난 이유에 대해서 나와있음
 * 
 * ChatServer에서는
 * 클라이언트 화면이 로딩된 후 실시간으로 방 목록 상태를 얻기 위하여 서버에서 방이 생성될 때나 방에 다른 클라이언트가 접속할 때 생성된 방 목록을
 * websocket을 이용하여 실시간으로 가져오는 기능을 구현한다.
 * 
 */
//socket.set(key,value) / socket.get(key,handler)를 이용하여 각 클라이언트의 값을 저장하고 get 메서드를 활용하여 값을 구할 수 있다.
io.sockets.on('connection',function(socket){
	
	socket.on('roommake',function(data){
		
		socket.join(data.roomname);//방이름으로 방을 만들고
		socket.set('room',data.roomname);//room에 data.roomname이라는 변수를 저장
		socket.set('nickname',data.nickname); //socket.set을 이용하여 자신의 방이름과 자신의 닉네임을 서버에 저장
		
		//설명 : 채팅방 입장 시 방에 입장해 있는 모든 사람에게 새로 입장한 사람의 닉네임을 표기해주는 부분을 처리합니다. Chatserver.js에서 
		//현재의 방 정보를 구하여 io.socket.in(room).emit()메서드를 이용하여 현재 입장한 사람의 닉네임을 방에 접속한 모든 클라이언트에게 보내준다.
		//방 목록 전송
		socket.get('nickname',function(err,name){//저장한 값을 얻어옴
			io.sockets.emit('roomlist',{"roomdata":io.sockets.manager.rooms,"clientid":socket.id,"nickname":name});
			socket.get("room",function(err,room){
				io.sockets['in'](room).emit('intro',name);
			});
		});
	
	});
	
	//message 처리
	//message를 받아서 해당 접속자의 닉네임, 방정보를 얻어와서 해당 방의 접속자에게 정보를 넘겨주는 코드
	socket.on('message',function(data){
		
		socket.get('nickname',function(err,name){
			socket.get('room',function(err,room){
				io.sockets['in'](room).emit('message_send',{'msg':data.msg,'from':name});
			});
		});
	});
	
	//퇴장시 처리
	//socket.on('disconnect',function(){}) 메서드를 호출하게 된다.
	//접속 종료시 처리 부분은 해당 메서드 안에서 처리함
	//퇴장자의 닉네임 전송과 동시에 클라이언트 화면에서 방 목록의 정보를 같이 변경
	socket.on('disconnect', function () {
		//방 목록 전송
		socket.get('nickname',function(err,nickname){
			socket.get('room',function(err,room){
				io.sockets['in'](room).emit('message_send_disconnect',{'msg':'','from':nickname});
			});
		});
		io.sockets.emit('room_research',null);
		
	
		
	});
	
});

