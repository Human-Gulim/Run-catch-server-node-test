/**
 * Chat Server Source
 * http://stackoverflow.com/questions/8636775/socket-io-using-the-name-in-makes-webstorm-ide-raise-error
 * 
 * ������ �� ������ ���ؼ� ��������
 * 
 * ChatServer������
 * Ŭ���̾�Ʈ ȭ���� �ε��� �� �ǽð����� �� ��� ���¸� ��� ���Ͽ� �������� ���� ������ ���� �濡 �ٸ� Ŭ���̾�Ʈ�� ������ �� ������ �� �����
 * websocket�� �̿��Ͽ� �ǽð����� �������� ����� �����Ѵ�.
 * 
 */
//socket.set(key,value) / socket.get(key,handler)�� �̿��Ͽ� �� Ŭ���̾�Ʈ�� ���� �����ϰ� get �޼��带 Ȱ���Ͽ� ���� ���� �� �ִ�.
io.sockets.on('connection',function(socket){
	
	socket.on('roommake',function(data){
		
		socket.join(data.roomname);//���̸����� ���� �����
		socket.set('room',data.roomname);//room�� data.roomname�̶�� ������ ����
		socket.set('nickname',data.nickname); //socket.set�� �̿��Ͽ� �ڽ��� ���̸��� �ڽ��� �г����� ������ ����
		
		//���� : ä�ù� ���� �� �濡 ������ �ִ� ��� ������� ���� ������ ����� �г����� ǥ�����ִ� �κ��� ó���մϴ�. Chatserver.js���� 
		//������ �� ������ ���Ͽ� io.socket.in(room).emit()�޼��带 �̿��Ͽ� ���� ������ ����� �г����� �濡 ������ ��� Ŭ���̾�Ʈ���� �����ش�.
		//�� ��� ����
		socket.get('nickname',function(err,name){//������ ���� ����
			io.sockets.emit('roomlist',{"roomdata":io.sockets.manager.rooms,"clientid":socket.id,"nickname":name});
			socket.get("room",function(err,room){
				io.sockets['in'](room).emit('intro',name);
			});
		});
	
	});
	
	//message ó��
	//message�� �޾Ƽ� �ش� �������� �г���, �������� ���ͼ� �ش� ���� �����ڿ��� ������ �Ѱ��ִ� �ڵ�
	socket.on('message',function(data){
		
		socket.get('nickname',function(err,name){
			socket.get('room',function(err,room){
				io.sockets['in'](room).emit('message_send',{'msg':data.msg,'from':name});
			});
		});
	});
	
	//����� ó��
	//socket.on('disconnect',function(){}) �޼��带 ȣ���ϰ� �ȴ�.
	//���� ����� ó�� �κ��� �ش� �޼��� �ȿ��� ó����
	//�������� �г��� ���۰� ���ÿ� Ŭ���̾�Ʈ ȭ�鿡�� �� ����� ������ ���� ����
	socket.on('disconnect', function () {
		//�� ��� ����
		socket.get('nickname',function(err,nickname){
			socket.get('room',function(err,room){
				io.sockets['in'](room).emit('message_send_disconnect',{'msg':'','from':nickname});
			});
		});
		io.sockets.emit('room_research',null);
		
	
		
	});
	
});

