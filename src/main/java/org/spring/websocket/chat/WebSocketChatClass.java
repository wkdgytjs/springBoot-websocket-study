package org.spring.websocket.chat;

import org.springframework.stereotype.Service;

import javax.websocket.*;
import javax.websocket.server.ServerEndpoint;
import java.util.Collections;
import java.util.HashSet;
import java.util.Set;

//@ServerEndpoint -> WebSocket매핑
@Service
@ServerEndpoint("/chat")
public class WebSocketChatClass {

    // 클라이언트의 정보나 메세지를 set설정
    // 채팅창에 메세지를 반환
    // 클라이언트 세션 정보를 가지고 있가. 접속(1), 해제삭제
    private static Set<Session> clientInfo=
            Collections.synchronizedSet(new HashSet<Session>()); // 세션을 적절히 관리(동시 접속자 관리)

    @OnOpen // 접속시 // 접속자 세션 설정
    public void onOpen(Session session){
        System.out.println("session start : "+ session.toString());
        // 저장되어있는 세션 정보가 없다면
        if(!clientInfo.contains(session)){
            // 세션 설정
            clientInfo.add(session);
            System.out.println("session open : "+ session);
        }else{
            System.out.println("pre session !");
        }
    }

    @OnMessage // 클라이언트 메세지를 수신할 때 // 접속자 session에 대한 메세지
    public void onMessage(String massage, Session session) throws Exception{
        System.out.println("return message : "+ massage);

        for(Session session1: clientInfo){
            System.out.println("trans data : "+massage);
            // .getBasicRemote() -> 전송자 url
            session1.getBasicRemote().sendText(massage);
        }
    }

    @OnClose // 접속 해제시 // 접속시 해제 설정
    public void onClose(Session session){
        System.out.println("session close : "+ session);
        clientInfo.remove(session);
    }

    @OnError // 에러 발생시
    public void onError(Throwable throwable){
        System.out.println("socket error : ");
        throwable.printStackTrace();
    }
}
