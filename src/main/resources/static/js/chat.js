let data = {}; // 전송데이터
let webSocket; // 웹소켓 url
let userId = document.querySelector("#userId"); // 접속자
let connectBtn = document.querySelector("#connectBtn"); // 접속이벤트
let sendBtn = document.querySelector("#sendBtn"); // 메세지 전송
let chatWindowCon = document.querySelector(".chatWindow-con"); // 채팅창
let msg = document.querySelector("#msg"); // 전송보낼 메세지

let url = "localhost:8090";

// 1. 웹소켓 접속=========================================================================
connectBtn.addEventListener("click", () => {
	// 웹소켓 접속                  // ServerEndpoint와 같은
	webSocket = new WebSocket("ws://" + url + "/chat");
	// 접속자 명이 null일때
	if (userId.value.length <= 0 || userId.value == "") {
		alert("접속자명 입력바랍니다.");
		userId.focus();
		return false;
	}
	alert(userId.value + "님이 접속하셨습니다.");

	// 소켓서버에 보낸 메세지를 받음
	webSocket.onmessage = function (msg) {
		// 소켓 메세지 수신 // 문자열 -> 객체로 변환
		let data = JSON.parse(msg.data);

		// div생성
		let divTag = document.createElement("div");
		let className;
		// 전송 아이이와 채팅 대상이 같으면
		if (data.userId == userId.value) {
			className = "yellow";
		} else {
			className = "white";
		}
		let item;
		item =
			"<div class='" +
			className +
			"'> <p><span>[작성자]: " +
			data.userId +
			"</span>[작성시간]: " +
			data.date +
			" <br/> ";
		item += "<span> 내용: " + data.msg + "</span></p></div>";

		divTag.innerHTML = item; // item -> 생성된 div태그에 추가

		chatWindowCon.append(divTag); // 생성된 div태그를 chatWindowCon 뒤에 순서대로 추가
	};
});

// 2. 메세지 전송==========================================================================
sendBtn.addEventListener("click", () => {
	sendMessageFn();
});

// 3. 전송 데이터==========================================================================
function sendMessageFn() {
	// if (msg.value.length <= 0 || msg.value == "") {
	// 	alert("메세지를 입력해주세요");
	// 	return false;
	// }

	// =
	// trim -> 공백 제거
	if (msg.value.trim().length > 0) {
		// 소켓 서버에 전송할 data
		data.userId = userId.value; // 작성자
		data.msg = msg.value; // 메세지
		data.date = new Date().toLocaleDateString(); // 시간
		// 객체 -> 문자열로 변환
		let sendData = JSON.stringify(data);

		webSocket.send(sendData); // data 전송
	}
}
