var ModuleChat = (function () {

    function getParameterByName(name) {
        name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
        var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
            results = regex.exec(location.search);
        return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
    }

    class Messsage {
        constructor(content, sender) {
            this.content = content;
            this.sender = sender;
        }
    }

    var stompClient =  null;
    const urlAPI = "https://teach2-me.herokuapp.com";
    var classId = getParameterByName("class");
    var email = localStorage.getItem("username");
    let _apiclient = urlAPI+"/js/apiclient.js";

    function putMessage(user,message,date){
        document.getElementById("message-container").innerHTML +="<div class=\"media msg \">\n" +
            "\n" +
            "                    <div class=\"media-body\">\n" +
            "                        <small class=\"pull-right time\"><i class=\"fa fa-clock-o\"></i>"+ date+"</small>\n" +
            "                        <h5 class=\"media-heading\">"+ user +"</h5>\n" +
            "                        <small class=\"col-lg-10\">"+ message+"</small>\n" +
            "                    </div>\n" +
            "                </div>";


    }

    function _map(list){
        var mapList = null;
        return mapList = list.map(function(message){
            return {
                content:message.content,
                sender:message.sender,
                date:message.date
            };
        });
    }

    function show(data){
        var listMessages = _map(data);
        listMessages.map(function(c){
            var date = c.date.split('T')[1].slice(0,5);
            putMessage(c.sender,c.content,date);
        });

    }

    function loadMessages(){
        apiclient.getMessagesById(classId,email, show, localStorage.getItem("Authorization"));

    }

    function connectToChat() {
        let socket = new SockJS(urlAPI + '/chat');
        stompClient = Stomp.over(socket);
        stompClient.connect({},function (frame) {
            stompClient.subscribe('/topic/messages.'+classId , function (response) {
                var message = JSON.parse(response.body);
                var dateSend = new Date();
                var date = dateSend.getHours()+":"+dateSend.getMinutes();
                putMessage(message.sender,message.content,date);
                $("#message-container").animate({scrollTop:200000},5000);
            });
        });
    }

    function sendMessage(_message){
        var message = new Messsage(_message,email);
        stompClient.send("/app/messages."+classId,{},JSON.stringify(message));
        $("#messageInput").val('');
    }

    function disconnect(){
        if (stompClient !== null) {
            stompClient.disconnect();
        }
    }

    return {
        connectToChat:connectToChat,
        sendMessage:sendMessage,
        loadMessages:loadMessages
    };
})();